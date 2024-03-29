from flask_mysqldb import MySQL
import json
from flask import request
from functions.validation import validate_username

def change_username(mysql: MySQL) -> dict:
    response = {"hasError": False}

    responseJson = json.loads(request.data.decode())
    
    if "user_id" not in responseJson or 'current' not in responseJson or 'new' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response
    
    user_id = responseJson["user_id"]
    current_user = responseJson["current"]
    new_user = responseJson["new"]

    valid, errors = validate_username(new_user)
    if not valid:
        response["hasError"] = True
        response["errorMessage"] = errors
        return response
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT username FROM users WHERE user_id=%s", (user_id,))
    user = cur.fetchone()

    if not user:
        response["hasError"] = True
        response["errorMessage"] = "User not found (Make sure you're signed in)"
        return response

    # make sure password matches
    if current_user == user['username']:
        try:
            cur.execute("UPDATE users SET username=%s WHERE user_id=%s", (new_user, user_id))
            mysql.connection.commit()
            cur.close()
            response["success"] = True
            return response
        except Exception as e:
            response["hasError"] = True
            response["errorMessage"] = str(e)
            mysql.connection.rollback()
            if cur:
                cur.close()
            return response
    
    else:
        response["hasError"] = True
        response["errorMessage"] = "Incorrect Username"

    return response

def change_password(mysql: MySQL) -> dict:
    response = {"hasError" : False}

    responseJson = json.loads(request.data.decode())

    if "user_id" not in responseJson or 'currPass' not in responseJson or 'newPass' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response
    
    currPass = responseJson["currPass"]
    newPass = responseJson["newPass"]
    user_id = responseJson["user_id"]
    
    # query the database to check if the user credentials are valid
    cur = mysql.connection.cursor()
    cur.execute("SELECT password FROM users WHERE user_id=%s", (user_id,))
    user = cur.fetchone()

    if not user:
        response["hasError"] = True
        response["errorMessage"] = "User not found (Make sure you're signed in)"
        return response

    # make sure password matches
    if currPass == user['password']:
        try:
            cur.execute("UPDATE users SET password=%s WHERE user_id=%s", (newPass, user_id))
            mysql.connection.commit()
            cur.close()
            response["success"] = True
            return response
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

def delete_user(mysql: MySQL) -> dict:
    response = {"hasError" : False}
    responseJson = json.loads(request.data.decode())

    if "user_id" not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response
    
    user_id = responseJson["user_id"]
    
    # query the database to check if the user credentials are valid
    cur = mysql.connection.cursor()
    cur.execute("SELECT user_id FROM users WHERE user_id=%s", (user_id,))
    user = cur.fetchone()

    if not user:
        response["hasError"] = True
        response["errorMessage"] = "User not found (Make sure you're signed in)"
        return response


    try:
        cur.execute("DELETE FROM users WHERE user_id=%s", (user_id,))
        mysql.connection.commit()
        cur.close()
        response["success"] = True
        return response
    except Exception as e:
        response["hasError"] = True
        response["errorMessage"] = str(e)
        mysql.connection.rollback()
        if cur:
            cur.close()
        return response