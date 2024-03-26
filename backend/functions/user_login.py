from flask_mysqldb import MySQL
import json
from flask import request
from functions.validation import validate_username, validate_email

def login(mysql: MySQL) -> dict:
    response = {"hasError" : False}

    responseJson = json.loads(request.data.decode())

    if 'username' not in responseJson or 'password' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response
    
    # accepts username or email for login
    username_or_email = responseJson['username'].strip()
    # username/email validation
    is_username = False
    is_email = False
    validUser, errors = validate_username(username_or_email)
    if validUser:
        is_username = True
    else:
        validEmail, errors = validate_email(username_or_email)
        if validEmail:
            is_email = True
    
    if not is_username and not is_email:
        response["hasError"] = True
        response["errorMessage"] = "Invalid format for username or email"
        return response

    encrypted_pw = responseJson['password']

    # query the database to check if the user credentials are valid
    cur = mysql.connection.cursor()
    cur.execute("SELECT user_id, password FROM users WHERE username = %s OR email = %s", (username_or_email, username_or_email))
    user = cur.fetchone()
    cur.close()

    if not user:
        response["hasError"] = True
        response["errorMessage"] = "User not found"
        return response

    # make sure password matches
    if encrypted_pw == user['password']:
        response["user_id"] = user['user_id']
        response["success"] = True
        del user['password']
        return response
    
    else:
        response["hasError"] = True
        response["errorMessage"] = "Invalid password"
        del user['password']

    return response