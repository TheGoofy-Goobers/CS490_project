import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import json
from flask_mysqldb import MySQL

class TestDatabase:
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
    
    # TODO: Remove mocks if possible by using test database
    @pytest.mark.parametrize("username,email,password", [("sampleUser", "sample.example@example.com", "somepassword")])
    def test_user_registration_success(self, client, username, email, password, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/registerNewUser", data=json.dumps({"username": username, "email": email, "password": password}))
        response = response.json

        assert response["success"]
        assert not response["hasError"]