from flask import request
import json
from functions import get_user_id
from typing import List

class Translations:
    def __init__(self, history: List[dict]):
        self.history = history
        self.updated = True

translation_cache = {}

def get_translation_history(mysql):
    response = {"hasError": False}

    responseJson = json.loads(request.data.decode())

    if "sessionToken" not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unknown error"
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

    if user_id in translation_cache:
        history = translation_cache[user_id]
        if history.updated:
            response["rows"] = history.history
            response["success"] = True
            return response
        else:
            del translation_cache[user_id]

    rows = None
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT translation_id, source_language, original_code, target_language, translated_code, submission_date FROM translation_history WHERE user_id=%s ORDER BY submission_date DESC", (user_id,))
        rows = cur.fetchall()
        translation_cache[user_id] = Translations(rows)
    except Exception as e:
        cur.close()
        response["hasError"] = True
        response["errorMessage"] = str(e)
        return response
    
    cur.close()
    response["success"] = True
    response["rows"] = rows
    return response