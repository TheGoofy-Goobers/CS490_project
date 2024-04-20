import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import json
from flask_mysqldb import MySQL
from mock import Mock
from functions import get_user_id
import re

class TestTwoFactor:
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
    

    @pytest.mark.parametrize("sessionToken,key,currPass", [("cbcc70c5-a45c-48e0-83df-b9714c9122a2", "9d832321b2d6e7c8c7d89671825b26fff21be4f4bbaf664f2df7e46d2336963a", "8c993db62acc31c261ae51de1a8e36d6fdd374b76dff81b9e1e3509e4b1e40d8")])
    def test_successful_qr_code_generation(self, client, sessionToken, key, currPass, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        mock = Mock(side_effect=[{"username": "testuser123", "password": "8c993db62acc31c261ae51de1a8e36d6fdd374b76dff81b9e1e3509e4b1e40d8"}])
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", mock)
        monkeypatch.setattr(get_user_id, "get_user_id", lambda mysql, token: (1, ""))

        response = client.post("/getQRCode", data=json.dumps({"sessionToken": sessionToken, "key": key, "currPass": currPass}))
        response = response.json

        assert "success" in response
        assert "qr" in response
        assert not response["hasError"]
        
        # check to make sure the response is base 64 encoded qr code
        assert re.compile(r'^[A-Za-z0-9+/]+={0,2}$').match(response["qr"])


    @pytest.mark.parametrize("passcode,sessionToken", [("123456", "cbcc70c5-a45c-48e0-83df-b9714c9122a2")])
    def test_valid_totp_setup_code(self, client, passcode, sessionToken, monkeypatch):
        # mocks connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        


    # mock invalid code

    # test valid encryption