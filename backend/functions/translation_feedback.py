from flask_mysqldb import MySQL
import json
from flask import request

#TODO: THIS
def submit_feedback(mysql: MySQL) -> dict:
    response = {"hasError": False}

    try:
        responseJson = json.loads(request.data.decode())

        user_id = responseJson['user_id']
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