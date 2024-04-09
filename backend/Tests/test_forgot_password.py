import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import json
from flask_mysqldb import MySQL
from mock import Mock
from functions import get_user_id
import smtplib

class TestForgotPassword:
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
    

    @pytest.mark.parametrize("email", [("notarealuser@njit.edu"), ("aaaaaaa@abc123.com"), ("username123"), ("mdefran131"), ("real-username")])
    def test_successful_email(self, client, email, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"user_id": 1, "email": "email@email.com", "username": "username"})

        response = client.post("/userSendEmail", data=json.dumps({"email": email}))
        response = response.json

        assert "success" in response
        assert response["success"]
        assert not response["hasError"]

    @pytest.mark.parametrize("email", [("notarealuser@njit.edu"), ("mdefran131")])
    def test_user_not_found(self, client, email, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/userSendEmail", data=json.dumps({"email": email}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"].startswith("User not found")

    @pytest.mark.parametrize("email", [("short"), ("--------"), ("email@email..com"), ("emailatemail.com"), ("email@emaildotcom"), ("email@email@email.com"), ("email@.com")])
    def test_invalid_email_or_username(self, client, email, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/userSendEmail", data=json.dumps({"email": email}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"].startswith("Invalid format for username or email")

    @pytest.mark.parametrize("email", [("email@email.com")])
    def test_failed_email(self, client, email, monkeypatch):
        def SeededError():
            raise Exception("Error sending email.")

        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"user_id": 1, "email": "email@email.com", "username": "username"})
        monkeypatch.setattr(smtplib, "SMTP", SeededError)

        response = client.post("/userSendEmail", data=json.dumps({"email": email}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"].startswith("Failed to send email")