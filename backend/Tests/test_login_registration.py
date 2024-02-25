import pytest
from backend.app import create_app
import json

class TestLoginRegistrationTests:
    @pytest.fixture()
    def app(self):
        app = create_app()
        app.config.update({
            "TESTING": True,
        })

        # other setup can go here

        yield app

        # clean up / reset resources here


    @pytest.fixture()
    def client(self, app):
        return app.test_client()


    @pytest.fixture()
    def runner(self, app):
        return app.test_cli_runner()
    
    def test_user_registration_success(self, client):
        response = client.post("/registerNewUser", data=json.dumps({"username": "sampleUser", "email": "sample.example@example.com", "password": "somepassword"}))
        response = response.json

        assert response["success"]
        assert not response["hasError"]

    def test_user_registration_leading_trailing_whitespace_passes(self, client):
        response = client.post("/registerNewUser", data=json.dumps({"username": "    sampleUser    ", "email": "\nsample.example@example.com\t", "password": "somepassword"}))
        response = response.json

        assert response["success"]
        assert not response["hasError"]

    def test_user_registration_invalid_username_returns_error_response(self, client):
        valid_email = "sample.example@example.com"
        valid_password = "somepassword"

        # test username is too short
        response = client.post("/registerNewUser", data=json.dumps({"username": "short", "email": valid_email, "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "emailErrors" not in response
        assert response["hasError"]
        assert "usernameErrors" in response
        assert len(response["usernameErrors"]) == 1

        # test username too long
        response = client.post("/registerNewUser", data=json.dumps({"username": "sampleUsernameIsFarTooLongAndThrowsError", "email": valid_email, "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "emailErrors" not in response
        assert response["hasError"]
        assert "usernameErrors" in response
        assert len(response["usernameErrors"]) == 1

        # test username uses no alphanumeric characters
        response = client.post("/registerNewUser", data=json.dumps({"username": "__------__", "email": valid_email, "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "emailErrors" not in response
        assert response["hasError"]
        assert "usernameErrors" in response
        assert len(response["usernameErrors"]) == 1

        # test username does not follow username format
        response = client.post("/registerNewUser", data=json.dumps({"username": "this$is$bad$format", "email": valid_email, "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "emailErrors" not in response
        assert response["hasError"]
        assert "usernameErrors" in response
        assert len(response["usernameErrors"]) == 1

    def test_user_registration_invalid_email_returns_error_response(self, client):
        valid_username = "sampleUser"
        valid_password = "somepassword"

        # test email length too long
        response = client.post("/registerNewUser", data=json.dumps({"username": valid_username, "email": "this.email@is.wayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy.toooooooooo.long", "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "usernameErrors" not in response
        assert response["hasError"]
        assert "emailErrors" in response
        assert len(response["emailErrors"]) == 1

        # test email invalid format 1
        response = client.post("/registerNewUser", data=json.dumps({"username": valid_username, "email": "thisemail@usesinvalidformat", "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "usernameErrors" not in response
        assert response["hasError"]
        assert "emailErrors" in response
        assert len(response["emailErrors"]) == 1

        # test email invalid format 2
        response = client.post("/registerNewUser", data=json.dumps({"username": valid_username, "email": "thisemail.also@usesinvalid-format", "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "usernameErrors" not in response
        assert response["hasError"]
        assert "emailErrors" in response
        assert len(response["emailErrors"]) == 1

        # test email invalid format 3
        response = client.post("/registerNewUser", data=json.dumps({"username": valid_username, "email": "thisemail@usesinvalidformat..also", "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "usernameErrors" not in response
        assert response["hasError"]
        assert "emailErrors" in response
        assert len(response["emailErrors"]) == 1