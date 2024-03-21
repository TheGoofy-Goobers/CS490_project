import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from app import create_app
import json
from flask_mysqldb import MySQL

class TestTranslationFeedback:
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
    
    @pytest.mark.parametrize("user_id,star_rating,note", [(7, 3, 'This is a correct note!'), (2, 1, 'This is another correct note that is slightly longer.')])
    def test_translation_feedback_success(self, client, user_id, star_rating, note, monkeypatch):
        # mock connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/translationFeedback", data=json.dumps({"user_id":user_id, "star_rating":star_rating, "note":note}))
        response = response.json

        assert response["success"]
        assert not response["hasError"]

    @pytest.mark.parametrize("user_id,star_rating,note", [(35, 0, 'This is a correct note!'), (6, 7, 'This is another correct note that is slightly longer.'), (2, 3.5, 'Correct.')])
    def test_invalid_translation_rating_value(self, client, user_id, star_rating, note, monkeypatch):
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/translationFeedback", data=json.dumps({"user_id":user_id, "star_rating":star_rating, "note":note}))
        response = response.json

        assert response["hasError"]
        assert "success" not in response
        assert "errorMessage" in response and response["errorMessage"] == "Invalid rating value(s)"

    long_string = """
    I'd just like to interject for a moment. What you're referring to as Linux,
    is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux.
    Linux is not an operating system unto itself, but rather another free component
    of a fully functioning GNU system made useful by the GNU corelibs, shell utilities
    and vital system components comprising a full OS as defined by POSIX.
    """
    @pytest.mark.parametrize("user_id,star_rating,note", [(1, 4, long_string)])
    def test_invalid_translation_note_length(self, client, user_id, star_rating, note, monkeypatch):
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/translationFeedback", data=json.dumps({"user_id":user_id, "star_rating":star_rating, "note":note}))
        response = response.json

        assert response["hasError"]
        assert "success" not in response
        assert "errorMessage" in response and response["errorMessage"] == "Invalid note string length"

    @pytest.mark.parametrize("user_id,star_rating,note", [(1, 5, 'This is a correct note!')])
    def test_translation_feedback_database_error(self, client, user_id, star_rating, note, monkeypatch):
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        def seeded_error(self, insertion, format):
            raise Exception("Database connection error.")
        monkeypatch.setattr(MockFlaskMysqlCursor, "execute", seeded_error)

        response = client.post("/translationFeedback", data=json.dumps({"user_id":user_id, "star_rating":star_rating, "note":note}))
        response = response.json

        assert response["hasError"]
        assert "success" not in response
        assert "errorMessage" in response and response["errorMessage"] == "Database connection error."