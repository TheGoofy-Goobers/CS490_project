from flask_mysqldb import MySQL
import json
from flask import request
from functions.validation import validate_username, validate_email
import uuid

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
    validUser, _ = validate_username(username_or_email)
    if validUser:
        is_username = True
    else:
        validEmail, _ = validate_email(username_or_email)
        if validEmail:
            is_email = True
    
    if not is_username and not is_email:
        response["hasError"] = True
        response["errorMessage"] = "Invalid format for username or email"
        return response

    encrypted_pw = responseJson['password']

    # query the database to check if the user credentials are valid
    user = None
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT user_id, password FROM users WHERE username = %s OR email = %s", (username_or_email, username_or_email))
        user = cur.fetchone()
    except Exception as e:
        cur.close()
        response["hasError"] = True
        response["errorMessage"] = str(e)
        return response

    if not user:
        response["hasError"] = True
        response["errorMessage"] = "User not found"
        return response

    # make sure password matches
    if encrypted_pw != user['password']:
        response["hasError"] = True
        response["errorMessage"] = "Invalid password"
        return response

    del user['password']

    #create uuid and store in db

    id = uuid.uuid4()
    try:
        print("LOGG INT")
        cur.execute("DELETE FROM logged_in WHERE user_id=%s", (user["user_id"],))
        cur.execute("INSERT INTO logged_in(user_id, session_token) VALUES(%s, %s)", (user["user_id"], id))
        mysql.connection.commit()
    except:
        mysql.connection.rollback()
        cur.close()
        response["hasError"] = True
        response["errorMessage"] = str(e)
        return response

    response["sessionToken"] = id
    response["success"] = True
    return response