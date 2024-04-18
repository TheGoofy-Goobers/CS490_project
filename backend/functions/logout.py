from flask_mysqldb import MySQL
import json
from flask import request
from functions.get_user_id import id_cache

def logout(mysql: MySQL) -> dict:
    response = {"hasError": False}

    responseJson = json.loads(request.data.decode())

    if "sessionToken" not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error." 
        return response

    sessionToken = responseJson["sessionToken"]
    if sessionToken == None or sessionToken == "":
        response["hasError"] = True
        response["errorMessage"] = "User has no session token set."
        return response
    
    try:
        if sessionToken in id_cache:
            id_cache.pop(sessionToken)
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM logged_in WHERE session_token = %s", (sessionToken,))
        mysql.connection.commit()
    except Exception as e:
        mysql.connection.rollback()
        if cur:
            cur.close()
        response["hasError"] = True
        response["errorMessage"] = str(e)
        return response
    
    cur.close()
    response["success"] = True
    return response