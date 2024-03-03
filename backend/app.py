from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import json
from functions import validate_email, validate_username
import os
from dotenv import load_dotenv

load_dotenv()

# All functions require a return statement
def create_app(testing: bool):
    api = Flask(__name__)
    CORS(api)

    # mysql configurations
    api.config['MYSQL_CURSORCLASS'] = 'DictCursor'
    if testing:
        api.config['MYSQL_HOST'] = 'localhost'
        api.config['MYSQL_USER'] = 'root'
        api.config['MYSQL_DB'] = 'codecraft'
        api.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
    else:
        api.config['MYSQL_HOST'] = os.getenv('DB_URL')
        api.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
        api.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
        api.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')

    mysql = MySQL(api)

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
        cur.close()
        
        response["success"] = True
        return response

    @api.route('/userLoginCredentials', methods=['POST'])
    def user_login():
        response = {"hasError" : False}

        responseJson = json.loads(request.data.decode())

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
            # TODO: set user session
            response["user_id"] = user['user_id']
            response["success"] = True
            del user['password']
            return response
        
        else:
            response["hasError"] = True
            response["errorMessage"] = "Invalid password"
            del user['password']

        return response
    
    @api.route('/userLogoffRequest')
    def user_logoff():
        # TODO: cancel user session
        pass
        
    @api.route('/submitFeedback', methods=['POST'])
    def submit_feedback():
        response = {"hasError": False}

        try:
            responseJson = json.loads(request.data.decode())

            user_id = responseJson['user_id']
            precision_rating = responseJson['precision_rating']
            ease_rating = responseJson['ease_rating']
            speed_rating = responseJson['speed_rating']
            future_use_rating = responseJson['future_use_rating']
            note = responseJson['note'].strip()

            if not all(rating in [1, 2, 3, 4, 5] for rating in [precision_rating, ease_rating, speed_rating, future_use_rating]):
                response["hasError"] = True
                response["errorMessage"] = "Invalid rating value(s)"
                return response

            if not 0 <= len(note) <= 300:
                response["hasError"] = True
                response["errorMessage"] = "Invalid note string length"
                return response

            insertion = """
            INSERT INTO user_feedback (user_id, precision_rating, ease_rating, speed_rating, future_use_rating, note) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """

            cur = mysql.connection.cursor()
            cur.execute(insertion, (user_id, precision_rating, ease_rating, speed_rating, future_use_rating, note))
            mysql.connection.commit()
            cur.close()

            response["success"] = True
        except Exception as e:
            mysql.connection.rollback()
            response["hasError"] = True
            response["errorMessage"] = str(e)
            return response

        return response

    return api