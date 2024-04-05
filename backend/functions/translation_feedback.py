from flask_mysqldb import MySQL
import json
from flask import request
from functions import get_user_id

def submit_feedback(mysql: MySQL) -> dict:
    response = {"hasError": False}

    responseJson = json.loads(request.data.decode())

    if 'sessionToken' not in responseJson or 'star_rating' not in responseJson or 'note' not in responseJson:
        response['hasError'] = True
        response['errorMessage'] = "Unexpected Error"
        return response
    
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
    
    star_rating = responseJson['star_rating']
    note = responseJson['note'].strip()

    if not star_rating in [1, 2, 3, 4, 5]:
        response["hasError"] = True
        response["errorMessage"] = "Invalid rating value(s)"
        return response
    
    if not 0 <= len(note) <= 150:
        response["hasError"] = True
        response["errorMessage"] = "Invalid note string length"
        return response
    
    try:
        insertion = "INSERT INTO translation_feedback (user_id, star_rating, note) VALUES (%s, %s, %s)"
        cur = mysql.connection.cursor()
        cur.execute(insertion, (user_id, star_rating, note))
        mysql.connection.commit()
        cur.close()

        response["success"] = True

    except Exception as e:
        mysql.connection.rollback()
        response["hasError"] = True
        response["errorMessage"] = str(e)
        if cur:
            cur.close()
        return response
    
    return response