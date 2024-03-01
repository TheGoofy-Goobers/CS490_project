import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import json
from flask_mysqldb import MySQL
class TestRegistrationLoginLogout:
    @pytest.fixture()
    def app(self):
        app = create_app(True)
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
    
    @pytest.mark.parametrize("username,email,password", [("sampleUser", "sample.example@example.com", "somepassword"), ("    sampleUser    ", "\nsample.example@example.com\t", "anotherpassword")])
    def test_user_registration_success(self, client, username, email, password, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/registerNewUser", data=json.dumps({"username": username, "email": email, "password": password}))
        response = response.json

        assert response["success"]
        assert not response["hasError"]

    @pytest.mark.parametrize("username", [("short"), ("sampleUsernameIsFarTooLongAndThrowsError"), ("__------__"), ("this$is$bad$format")])
    def test_user_registration_invalid_username_returns_error_response(self, client, username):
        valid_email = "sample.example@example.com"
        valid_password = "somepassword"

        response = client.post("/registerNewUser", data=json.dumps({"username": username, "email": valid_email, "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "emailErrors" not in response
        assert response["hasError"]
        assert "usernameErrors" in response
        assert len(response["usernameErrors"]) == 1

    @pytest.mark.parametrize("email", [("this.email@is.wayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy.toooooooooo.long"),
                                        ("thisemail@usesinvalidformat"), ("thisemail.also@usesinvalid-format"), ("thisemail@usesinvalidformat..also")])
    def test_user_registration_invalid_email_returns_error_response(self, client, email):
        valid_username = "sampleUser"
        valid_password = "somepassword"

        response = client.post("/registerNewUser", data=json.dumps({"username": valid_username, "email": email, "password": valid_password}))
        response = response.json

        assert "success" not in response
        assert "usernameErrors" not in response
        assert response["hasError"]
        assert "emailErrors" in response
        assert len(response["emailErrors"]) == 1

    # TODO: These unit tests
    @pytest.mark.parametrize("username", [("duplicateUser")])
    def test_user_registration_duplicate_username_fails(self, client, username, monkeypatch):
        # mocks
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        def seededReturn(self):
            return {"username": "duplicateUser", "email" : "valid@email.com"}
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", seededReturn)

        response = client.post("/registerNewUser", data=json.dumps({"username": username, "email": "sample.example@example.com", "password": "somepassword"}))
        response = response.json
        
        assert "success" not in response
        assert response["hasError"]
        assert "sqlErrors" in response
        assert len(response["sqlErrors"]) == 1 and response["sqlErrors"][0] == "Chosen username already in use"

    @pytest.mark.parametrize("email", [("duplicate@email.com")])
    def test_user_registration_duplicate_email_fails(self, client, email, monkeypatch):
        # mocks
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        def seededReturn(self):
            return {"username": "validUser", "email" : "duplicate@email.com"}
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", seededReturn)

        response = client.post("/registerNewUser", data=json.dumps({"username": "sampleUser", "email": email, "password": "somepassword"}))
        response = response.json
        
        assert "success" not in response
        assert response["hasError"]
        assert "sqlErrors" in response
        assert len(response["sqlErrors"]) == 1 and response["sqlErrors"][0] == "Chosen email already in use"

    @pytest.mark.parametrize("username,password", [("validUser", "validPassword"), ("valid@email.com", "validPassword")])
    def test_user_login_success(self, client, username, password, monkeypatch):
        # mocks
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        def seededReturn(self):
            return {"user_id": "1", "password" : "validPassword"}
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", seededReturn)

        response = client.post("/userLoginCredentials", data=json.dumps({"username": username, "password": password}))
        response = response.json

        assert "success" in response and response["success"]
        assert not response["hasError"]
        assert "user_id" in response and response["user_id"] == '1'

    
    def test_user_login_unrecognized_username_or_email_returns_error_response(self, client):
        pass

    def test_user_login_password_incorrect_returns_error_response(self, client):
        pass
    
    @pytest.mark.parametrize("username", [("bad@userOrEmail")])
    def test_user_login_invalid_username_or_email_returns_error_response(self, client, username):
        response = client.post("/userLoginCredentials", data=json.dumps({"username": username, "password": "mockpassword"}))
        response = response.json
        
        assert "success" not in response
        assert response["hasError"]
        assert "errorMessage" in response
        assert response["errorMessage"] == "Invalid format for username or email"

    # TODO: This unit test
    def test_user_logout_success(self, client):
        pass

