from flask import Flask, request
from flask_cors import CORS
import json
from backend.functions import validate_email, validate_username
import mysql.connector

# All functions require a return statement

def create_app():
    api = Flask(__name__)
    CORS(api)

    # test method - remove later
    @api.route('/profile')
    def my_profile():
        response_body = {
            "name": "Nagato",
            "about" :"Hello! I'm a full stack developer that loves python and javascript"
        }

        return response_body

    @api.route('/registerNewUser', methods = ["POST"])
    def registerNewUser():
        response = {"hasError" : False}

        responseJson = json.loads(request.data.decode())

        username = responseJson['username'].strip()
        email = responseJson['email'].strip()
        # all password checks should be on frontend
        encryptedPW = responseJson["password"]

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
        
        #query db to make sure email and username are unique
        
        #insert into db
        
        response["success"] = True
        return response

    @api.route('/userLoginCredentials', methods=['POST'])
    def user_login():
        response = {"hasError" : False}

        responseJson = json.loads(request.data.decode())

        # accepts username or email for login
        username_or_email = responseJson['username']
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

        # TODO: query DB 
        # Query the database to check if the user credentials are valid
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username_or_email, username_or_email))
        user = cur.fetchone()  # Assuming the query returns one user record
        cur.close()

        if user:
            # Check if the password matches (assuming the password is encrypted in the database)
            if encrypted_pw == user['encrypted_password']:
                # User authenticated successfully, you can handle the session or token management here
                response["user_id"] = user['id']
                return response
            else:
                response["hasError"] = True
                response["errorMessage"] = "Invalid password"
                return response
        else:
            response["hasError"] = True
            response["errorMessage"] = "User not found"
            return response
        
    return api

create_app()