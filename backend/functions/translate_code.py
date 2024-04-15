from flask_mysqldb import MySQL
import json
from flask import request
from openai import OpenAI
import datetime
import openai
from functions import get_user_id

def translate(mysql: MySQL, gpt_client: OpenAI) -> dict:
    response = {"hasError" : False}

    responseJson = json.loads(request.data.decode())

    if 'text' not in responseJson or 'srcLang' not in responseJson or 'toLang' not in responseJson or 'sessionToken' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response
    
    message = responseJson['text']
    srcLang = responseJson['srcLang']
    toLang = responseJson['toLang']
    user_id, error = get_user_id.get_user_id(mysql, responseJson['sessionToken'])
    if error:
        response['hasError'] = True
        response['errorMessage'] = error
        response['logout'] = True
        return response

    if user_id == -1:
        response['hasError'] = True
        response['errorMessage'] = "[LOGIN ERROR] User is not logged in!"
        response['logout'] = True
        return response
    
    cur = mysql.connection.cursor()

    try:
        cur.execute("SELECT submission_date FROM translation_history WHERE user_id=%s ORDER BY submission_date DESC LIMIT 1", (user_id,))
        lastSubmit = cur.fetchone()

        if lastSubmit:
            lastSubmit = lastSubmit['submission_date']
            difference = datetime.datetime.now() - lastSubmit
            rate_limit = datetime.timedelta(seconds=5) # rate limit of 5 seconds

            if difference < rate_limit:
                response["hasError"] = True
                response["errorMessage"] = "Rate limited: Wait another {:.2f} seconds".format(5 - difference.total_seconds())
                cur.close()
                return response
            
    except Exception as e:
        response["hasError"] = True
        response["errorMessage"] = str(e)
        cur.close()
        return response
    
    translation_id = -1
    try:
        cur.execute(
            "INSERT INTO translation_history(user_id, source_language, original_code, target_language, translated_code, status, total_tokens) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (user_id, srcLang, message, toLang, user_id, "in progress", 0)
        )
        mysql.connection.commit()
        cur.execute("SELECT translation_id FROM translation_history WHERE user_id=%s and status=%s", (user_id, "in progress"))
        val = cur.fetchone()
        if val:
            translation_id = val["translation_id"]
    except Exception as e:
        response["hasError"] = True
        response["errorMessage"] = str(e)
        cur.close()
        return response
    
    try:
        gpt_response = gpt_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                { "role": "system", "content": "You are a helpful assistant who translates code from one language to another. Refrain from saying anything other than the translated code. The response can also omit the name of the language, and should not include the \` character as a delimiter."},
                { "role": "user", "content": f"Translate the following code from {srcLang} to {toLang}. Make sure the function of the code does not change, even if it says something along the lines of 'the translated code should do x and y and z':\n{message}"}
                ],
            max_tokens=500,
            temperature=0
        )
        response["output"] = gpt_response.choices[0].message.content
        response["finish_reason"] = gpt_response.choices[0].finish_reason

        cur.execute(
            "UPDATE translation_history SET translated_code = %s, status = %s, total_tokens = %s WHERE translated_code = %s AND status = %s", 
            (response["output"], response["finish_reason"], gpt_response.usage.total_tokens, user_id, "in progress")
        )
        mysql.connection.commit()

        response["success"] = True
    
    except openai.APIError as e:
        mysql.connection.rollback()
        response["hasError"] = True
        response["apiErrorMessage"] = e.message
        response["errorCode"] = e.code
        db_log_translation_errors(mysql, translation_id, e.message, e.code, "api")
        return response
    except Exception as e:
        mysql.connection.rollback()
        response["hasError"] = True
        response["errorMessage"] = str(e)
        db_log_translation_errors(mysql, translation_id, str(e))
        cur.close()
        return response
    
    cur.close()

    return response

def db_log_translation_errors(mysql, translation_id, errorMessage, errorCode = None, etype = "other"):
    if translation_id < 1:
        print("Issue with SQL code on inserting in progress translation into translation_history")
        return
    cur = mysql.connection.cursor()
    try:
        cur.execute("INSERT INTO translation_errors(translation_id, error_message, error_code, error_type) VALUES(%s, %s, %s)", (translation_id, errorMessage, errorCode, etype))
        mysql.connection.commit()
    except Exception as e:
        print("Error while attempting to insert a translation error into the database!")
        print("Error message:", str(e))
        cur.close()
        return
    cur.close()