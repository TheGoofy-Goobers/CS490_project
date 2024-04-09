import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import json
from flask_mysqldb import MySQL
from mock import Mock
from functions import get_user_id
from Tests.setup_and_teardown import setup, teardown

class TestSql:
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
    
    #@pytest.mark.parametrize("oldUser,newUser,sessionToken", [("username", "username1", "cbcc70c5-a45c-48e0-83df-b9714c9122a2")])
    def test_one(self):
        assert True
