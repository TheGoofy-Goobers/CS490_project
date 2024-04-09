import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import os
from dotenv import load_dotenv
from flask_mysqldb import MySQL
import mysql.connector
from Tests.setup_and_teardown import setup, teardown

# *************************** TEST INFORMATION *************************** #
# THESE TESTS TEST ONLY THE SQL CALLS USED IN OTHER FUNCTIONS. THE TABLE   #
# IS PRE-FILLED WITH SOME TESTING VALUES. LOOK IN TESTS/SETUP_AND_TEARDOWN #
# IF YOU WISH TO SEE THE EXACT VALUES THAT ARE BEING PLACED IN THE TABLE   #
# ------------------------------------------------------------------------ #
# IF ANY SQL QUERIES ARE CHANGED IN ANY EXISTING FUNCTIONS, IT IS CRUCIAL  #
# THAT THEIR CORRESPONDING TESTING QUERIES ARE CHANGED IN THIS TESTING     #
# FILE IN ORDER TO ENSURE THAT THE QUERIES BEING TESTED ARE ACCURATE       #
# *************************** TEST INFORMATION *************************** #

connection = None

class TestSql:
    @classmethod
    def setup_class(TestSql):
        load_dotenv()

        mysql_config = {
            'host': os.getenv('DB_URL'),
            'user': os.getenv('MYSQL_USER'),
            'password': os.getenv('MYSQL_PASSWORD'),
            'database': 'codecraft_testing'
        }

        global connection
        connection = mysql.connector.connect(**mysql_config)

    @classmethod
    def teardown_class(TestSql):
        global connection
        connection.close()
        
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
    
    @pytest.mark.parametrize("username,email,password,expectExisting", [("username1", "email@email.com", "password", True), ("unique", "email@email.com", "password", False)])
    def test_registration_sql(self, username, email, password, expectExisting):
        cur = connection.cursor()

        try:
            cur.execute("SELECT username, email FROM users WHERE username = %s OR email = %s", (username, email)) # Exact query used in register_user.py
            existing_user = cur.fetchone()
            if expectExisting:
                assert existing_user
            else:
                assert not existing_user
        except Exception as e:
            assert str(e) and False
        
        if not expectExisting:
            try:
                cur.execute("INSERT INTO users(username, email, password) VALUES (%s, %s, %s)", (username, email, password))
                connection.commit()
            except Exception as e:
                assert str(e) and False

            try:
                cur.execute("SELECT * FROM users WHERE user_id = 1 AND username = %s AND email = %s AND password = %s", (4, username, email, password))
            except Exception as e:
                assert str(e) and False
                
        cur.close()