from functions import get_user_id
import pytest
from flask_mysqldb import MySQL
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor

class TestFunctions:
    # TODO: Do this if we have extra time
    # def test_validation()

    def test_get_user_id(self, monkeypatch):
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        #Test some unexpected error with sql query
        def seeded_error(self, query, format=None):
            raise Exception("Error in SQL query.")
        monkeypatch.setattr(MockFlaskMysqlCursor, "execute", seeded_error)
        mysql = MySQL()
        user_id, error = get_user_id.get_user_id(mysql, "some token")

        assert user_id == -1
        assert error == "Error in SQL query."

        #Test success
        monkeypatch.setattr(MockFlaskMysqlCursor, "execute", lambda self, query, format=None: None)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda self: {"user_id": 1})

        user_id, error = get_user_id.get_user_id(mysql, "some token")

        assert user_id == 1
        assert error == ""