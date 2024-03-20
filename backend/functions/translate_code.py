from flask_mysqldb import MySQL
import json
from flask import request
from openai import OpenAI

#TODO: THIS
def translate(mysql: MySQL, gpt_client: OpenAI) -> dict:
    response = {"hasError" : False}

    responseJson = json.loads(request.data.decode())

    if 'text' not in responseJson or 'srcLang' not in responseJson or 'toLang' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response
    
    message = responseJson['text']
    srcLang = responseJson['srcLang']
    toLang = responseJson['toLang']
    user_id = responseJson['user_id']

    try:
        gpt_response = gpt_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                { "role": "system", "content": "You are a helpful assistant who translates code from one language to another. Refrain from saying anything other than the translated code. The response can also omit the name of the language."},
                { "role": "user", "content": f"Translate this code from {srcLang} to {toLang}:\n{message}"}
                ],
            max_tokens=500,
            temperature=0
        )
        response["output"] = gpt_response.choices[0].message.content
        response["finish_reason"] = gpt_response.choices[0].finish_reason

        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO translation_history(user_id, source_language, original_code, target_language, translated_code, status, total_tokens) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
            (user_id, srcLang, message, toLang, response["output"], response["finish_reason"], gpt_response.usage.total_tokens)
        )
        cur.connection.commit()
        cur.close()

        response["success"] = True
    except Exception as e:
        response["hasError"] = True
        response["errorMessage"] = str(e)
        return response
    
    return response