import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import json
from flask_mysqldb import MySQL
from mock import Mock

class TestRegistrationLogin:
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
    
    @pytest.mark.parametrize("oldUser,newUser,userId", [("username", "username1", 1)])
    def test_username_change_success(self, client, oldUser, newUser, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"username": oldUser})

        response = client.post("/userChangeUsername", data=json.dumps({"current": oldUser, "new": newUser, "user_id": userId}))
        response = response.json

        assert "success" in response
        assert response["success"]
        assert not response["hasError"]
    
    @pytest.mark.parametrize("oldUser,newUser,userId", [("username", "username112312312322222222222222222222222toolong", 1), ("username", "--------", 1), ("username", "short", 1), ("username", "__-----__$", 1)])
    def test_username_change_bad_username__format(self, client, oldUser, newUser, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"username": oldUser})

        response = client.post("/userChangeUsername", data=json.dumps({"current": oldUser, "new": newUser, "user_id": userId}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]

    @pytest.mark.parametrize("oldUser,newUser,userId", [("username", "username1", 1)])
    def test_change_username_no_user_found(self, client, oldUser, newUser, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/userChangeUsername", data=json.dumps({"current": oldUser, "new": newUser, "user_id": userId}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"].startswith("User not found")

    @pytest.mark.parametrize("oldUser,newUser,userId", [("username", "username1", 1)])
    def test_change_username_incorrect_username(self, client, oldUser, newUser, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"username": oldUser + "random"})

        response = client.post("/userChangeUsername", data=json.dumps({"current": oldUser, "new": newUser, "user_id": userId}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"] == "Incorrect Username"

    @pytest.mark.parametrize("oldPass,newPass,userId", [("password", "password2", 1)])
    def test_password_change_success(self, client, oldPass, newPass, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"password": oldPass})

        response = client.post("/userChangePassword", data=json.dumps({"currPass": oldPass, "newPass": newPass, "user_id": userId}))
        response = response.json

        assert "success" in response
        assert response["success"]
        assert not response["hasError"]

    @pytest.mark.parametrize("oldPass,newPass,userId", [("password", "password2", 1)])
    def test_change_password_no_user_found(self, client, oldPass, newPass, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/userChangePassword", data=json.dumps({"currPass": oldPass, "newPass": newPass, "user_id": userId}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"].startswith("User not found")

    @pytest.mark.parametrize("oldPass,newPass,userId", [("password", "password2", 1)])
    def test_change_password_incorrect_password(self, client, oldPass, newPass, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"password": oldPass + "random"})

        response = client.post("/userChangePassword", data=json.dumps({"currPass": oldPass, "newPass": newPass, "user_id": userId}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"] == "Invalid password"

    @pytest.mark.parametrize("userId", [(1)])
    def test_delete_account_success(self, client, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"user_id", userId})

        response = client.post("/deleteAccount", data=json.dumps({"user_id": userId}))
        response = response.json

        assert "success" in response
        assert response["success"]
        assert not response["hasError"]

    @pytest.mark.parametrize("userId", [(1)])
    def test_delete_account_no_user_found(self, client, userId, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/deleteAccount", data=json.dumps({"user_id": userId}))
        response = response.json

        assert "success" not in response
        assert response["hasError"]
        assert response["errorMessage"].startswith("User not found")