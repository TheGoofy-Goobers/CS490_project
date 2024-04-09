import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
from flask_mysqldb import MySQL
from app import create_app
import json

class TestTranslationHistory:
    @pytest.fixture()
    def app(self):
        app = create_app(True)
        app.config.update({
            "TESTING": True,
        })
        yield app

    @pytest.fixture()
    def client(self, app):
        return app.test_client()
    
    def test_get_translation_history_success(self, client, monkeypatch):
        # Setup mock data for translation history
        history_data = [
            {"id": 1, "original_code": "print('Hello')", "translated_code": "echo 'Hello'", "source_language": "Python", "target_language": "PHP", "user_id": 1, "submission_date": "2023-04-01 10:00:00"}
            # Add more mock history records if necessary
        ]

        # Create an instance of the mock cursor and set the mock data
        mock_cursor = MockFlaskMysqlCursor()
        mock_cursor.set_fetchall_data(history_data)

        # Mock MySQL cursor and connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr('flask_mysqldb.MySQL.connection.cursor', lambda: mock_cursor)

        # Send GET request with mocked session token
        response = client.get("/api/translation-history", query_string={"sessionToken": "valid-session-token"})
        response_data = response.json

        # Assert response data matches mock history data
        assert response.status_code == 200
        assert response_data == history_data

    def test_get_translation_history_invalid_session_token(self, client, monkeypatch):
        # Mock MySQL cursor and connection
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        monkeypatch.setattr(MockFlaskMysqlCursor, "execute", lambda *args, **kwargs: None)
        monkeypatch.setattr(MockFlaskMysqlCursor, "fetchone", lambda *args, **kwargs: None)

        # Send GET request with invalid session token
        response = client.get("/api/translation-history", query_string={"sessionToken": "invalid-session-token"})
        response_data = response.json

        # Assert response is error with invalid session token message
        assert response.status_code == 404
        assert "error" in response_data and response_data["error"] == "Invalid session token"
