from flask import Flask, request
from flask_cors import CORS
import json

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
    print(json.loads(request.data.decode())['data'])
    return request.data

@api.route('/registerNewUser', methods = ["POST"])
def registerNewUser():
    responseJson = json.loads(request.data.decode())

    username = responseJson['username']
    email = responseJson['email']
    # all password checks should be on frontend
    encryptedPW = responseJson["password"]

    #email sanitization
    #basic username check
    #query db to make sure email and username are unique
    
    #insert into db
    