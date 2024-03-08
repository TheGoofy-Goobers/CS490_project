from flask_mysqldb import MySQL
import json
from flask import request
from functions.validation import validate_username, validate_email

def register(mysql: MySQL) -> dict:
    response = {"hasError" : False}

    responseJson = json.loads(request.data.decode())

    if 'username' not in responseJson or 'email' not in responseJson or 'password' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response

    username = responseJson['username'].strip()
    email = responseJson['email'].strip()
    # all password checks should be on frontend
    encrypted_pw = responseJson["password"]

    # username validation
    validUser, errors = validate_username(username)
    if not validUser:
        response["hasError"] = True
        response["usernameErrors"] = errors

    # email validation
    validEmail, errors = validate_email(email)
    if not validEmail:
        response["hasError"] = True
        response["emailErrors"] = errors

    if response["hasError"]:
        return response
    
    # query db to make sure email and username are unique
    cur = mysql.connection.cursor()
    cur.execute("SELECT username, email FROM users WHERE username = %s OR email = %s", (username, email))
    existing_user = cur.fetchone()

    if existing_user:
        response["hasError"] = True
        response["sqlErrors"] = []
        if existing_user["username"] == username:
            response["sqlErrors"].append("Chosen username already in use")
        if existing_user["email"] == email:
            response["sqlErrors"].append("Chosen email already in use")
        return response
    
    # insert new user into db
    cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, encrypted_pw))
    mysql.connection.commit()

    # return user id
    cur.execute("SELECT user_id FROM users WHERE username=%s", (username,))
    user = cur.fetchone()
    user_id = user["user_id"]
    cur.close()

    response["success"] = True
    response["user_id"] = user_id
    return response