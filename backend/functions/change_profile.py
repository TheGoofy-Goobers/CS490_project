from flask_mysqldb import MySQL
import json
from flask import request
from functions.validation import validate_username, validate_email

def change_username(mysql: MySQL) -> dict:
    pass

def change_password(mysql: MySQL) -> dict:
    response = {"hasError" : False}

    responseJson = json.loads(request.data.decode())

    if "user_id" not in response.json or 'currPass' not in responseJson or 'newPass' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response
    
    currPass = responseJson["currPass"]
    newPass = responseJson["newPass"]
    user_id = responseJson["user_id"]
    
    # # query the database to check if the user credentials are valid
    cur = mysql.connection.cursor()
    cur.execute("SELECT password FROM users WHERE user_id=%s", (user_id,))
    user = cur.fetchone()

    if not user:
        response["hasError"] = True
        response["errorMessage"] = "User not found (Make sure you're signed in)"
        return response

    # make sure password matches
    if currPass == user['password']:
        print(currPass)
        print(newPass)
        try:
            cur.execute("UPDATE users SET password=%s WHERE user_id=%s", (newPass, user_id))
            cur.commit()
            cur.close()
        except Exception as e:
            response["hasError"] = True
            response["errorMessage"] = str(e)
            mysql.connection.rollback()
            if cur:
                cur.close()
            return response
    
    else:
        response["hasError"] = True
        response["errorMessage"] = "Invalid password"
        del user['password']

    return response