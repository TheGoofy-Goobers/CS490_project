from flask import Flask, request
from flask_cors import CORS
import json
from functions import validate_email, validate_username

# All functions require a return statement

api = Flask(__name__)
CORS(api)

@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body

@api.route('/test_post', methods = ['GET', 'POST'])
def test_post():
    if request.method == 'POST':
        print(json.loads(request.data.decode())['data'])
        return request.data.decode()
    return ""

@api.route('/registerNewUser', methods = ["POST"])
def registerNewUser():
    response = {"errors" : False}

    responseJson = json.loads(request.data.decode())

    username = responseJson['username'].strip()
    email = responseJson['email'].strip()
    # all password checks should be on frontend
    encryptedPW = responseJson["password"]

    # TODO: When done with testing, this line and all other prints should be removed
    print(f"Username: {username}\nEmail: {email}\nPW: {encryptedPW}\n")

    # username validation
    validUser, errors = validate_username(username)
    if not validUser:
        response["errors"] = True
        response["usernameErrors"] = errors
        print(errors)

    # email validation
    validEmail, errors = validate_email(email)
    if not validEmail:
        response["errors"] = True
        response["emailErrors"] = errors
        print(errors)

    #query db to make sure email and username are unique
    
    #insert into db
    
    return response