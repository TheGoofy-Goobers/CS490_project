from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from openai import OpenAI
import os
from dotenv import load_dotenv

from functions import register_user as register, user_login as login, submit_feedback as feedback, translate_code as translate, translation_feedback as translationFeedback
from functions import api_status as status, change_profile as profile

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
    
    gpt_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # registration page
    @api.route('/registerNewUser', methods = ["POST"])
    def register_user():
        return register.register(mysql)


    # login page
    @api.route('/userLoginCredentials', methods=['POST'])
    def user_login():
        return login.login(mysql)
        

    #feedback page
    @api.route('/submitFeedback', methods=['POST'])
    def submit_feedback():
        return feedback.submit_feedback(mysql)


    # code translation backend
    @api.route('/translate', methods=['POST'])
    def translate_code():
        return translate.translate(mysql, gpt_client)


    # translation feedback
    @api.route('/translationFeedback', methods=['POST'])
    def translation_feedback():
        return translationFeedback.submit_feedback(mysql)


    @api.route('/getApiStatus')
    def get_status():
        return status.get_status(gpt_client.api_key)
    

    @api.route('/userChangeUsername', methods=['POST'])
    def change_username():
        return profile.change_username(mysql)


    @api.route('/userChangePassword', methods=['POST'])
    def change_password():
        return profile.change_password(mysql)


    @api.route('/deleteAccount', methods=['POST'])
    def delete_account():
        return profile.delete_user(mysql)

    return api