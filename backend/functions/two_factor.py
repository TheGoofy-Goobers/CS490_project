from flask_mysqldb import MySQL
import json
from flask import request
import get_user_id
import time
import pyotp
import qrcode
import os
import base64

def generate_qr_code(mysql: MySQL) -> dict:
    response = {"hasError": False}

    responseJson = json.loads(request.data.decode())

    user_id, error = get_user_id.get_user_id(mysql, responseJson['sessionToken'])
    if error:
        response['hasError'] = True
        response['errorMessage'] = error
        response['logout'] = True
        return response

    if user_id == -1:
        response['hasError'] = True
        response['errorMessage'] = "[LOGIN ERROR] User is not logged in!"
        response['logout'] = True
        return response

    # generate a key
    key = pyotp.random_base32()
    uri = pyotp.totp.TOTP(key).provisioning_uri(name=user_id, issuer_name='CodeCraft')

    if not uri:
        response['hasError'] = True
        response['errorMessage'] = 'Error generating key'
        response['logout'] = True
        return response

    # TODO: encrypt the key

    # store the key
    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE users SET totp = %s WHERE user_id = %s", (key, user_id))
        mysql.connection.commit()
        cur.close()
    except Exception as e:
        response["hasError"] = True
        response["errorMessage"] = str(e)
        mysql.connection.rollback()
        cur.close()
        return response

    # generate and send the qr code to the frontend
    img = qrcode.make(uri)
    encoded_img = base64.b64encode(img).decode('utf-8')

    response["qr"] = encoded_img
    response["success"] = True
    return response

def validate_totp(mysql: MySQL) -> dict:
    response = {"hasError": False}

    responseJson = json.loads(request.data.decode())

    if 'passcode' not in responseJson:
        response["hasError"] = True
        response["errorMessage"] = "Unexpected error"
        return response

    passcode = responseJson['passcode'].strip()

    user_id, error = get_user_id.get_user_id(mysql, responseJson['sessionToken'])
    if error:
        response['hasError'] = True
        response['errorMessage'] = error
        response['logout'] = True
        return response

    if user_id == -1:
        response['hasError'] = True
        response['errorMessage'] = "[LOGIN ERROR] User is not logged in!"
        response['logout'] = True
        return response

    # fetch the key from the database
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT totp FROM users WHERE user_id = %s", (user_id,))
        key = cur.fetchone()
    except Exception as e:
        cur.close()
        response["hasError"] = True
        response["errorMessage"] = str(e)
        return response    

    if not key:
        response["hasError"] = True
        response["errorMessage"] = "Key not found"
        return response
    
    # TODO: decrypt the key

    # verify the code is correct
    totp = pyotp.TOTP(key)
    verified = totp.verify(passcode)

    response["verified"] = verified
    response["success"] = True
    return response