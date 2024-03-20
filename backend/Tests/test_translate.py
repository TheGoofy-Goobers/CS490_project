import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
import Tests.Mocks.MockGptApi as MockGpt
from app import create_app
import json
from flask_mysqldb import MySQL
from openai import resources


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
    
    @pytest.mark.parametrize("text,srcLang,toLang,user_id", [("print('hello world!')", "python", "java", 1)])
    def test_translation_success(self, client, text, srcLang, toLang, user_id, monkeypatch):
        choices = [MockGpt.completion_choice_builder(
            finish_reason="stop",
            index=0,
            logprobs=None,
            content="System.out.println(\"hello world!\");",
            role="assistant",
            function_call=None,
            tool_calls=None
            )]
        
        gpt_response = MockGpt.completion_response_builder(
            choices=choices,
            id="chatcmpl-925pb878hKeuj7abfDnQmKEezr05I",
            created=1710286099,
            model="gpt-3.5-turbo-0125",
            object="chat.completion",
            system_fingerprint="fp_abcd123456",
            completion_tokens=7,
            prompt_tokens=60,
            total_tokens=67
            )
        
        monkeypatch.setattr(resources.chat.Completions, "create", lambda self, model, messages, max_tokens, temperature: gpt_response)
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        response = client.post("/translate", data=json.dumps({"text": text, "srcLang": srcLang, "toLang": toLang, "user_id": user_id}))
        response = response.json

        assert response["success"]
        assert not response["hasError"]
        assert "output" in response
        assert "finish_reason" in response and response["finish_reason"] == "stop"
        assert response["output"] == "System.out.println(\"hello world!\");"


    @pytest.mark.parametrize("text,srcLang,toLang,user_id", [("print('hello world!')", "python", "java", 1)])
    def test_database_connection_error(self, client, text, srcLang, toLang, user_id, monkeypatch):
        choices = [MockGpt.completion_choice_builder(
            finish_reason="stop",
            index=0,
            logprobs=None,
            content="System.out.println(\"hello world!\");",
            role="assistant",
            function_call=None,
            tool_calls=None
            )]
        
        gpt_response = MockGpt.completion_response_builder(
            choices=choices,
            id="chatcmpl-925pb878hKeuj7abfDnQmKEezr05I",
            created=1710286099,
            model="gpt-3.5-turbo-0125",
            object="chat.completion",
            system_fingerprint="fp_abcd123456",
            completion_tokens=7,
            prompt_tokens=60,
            total_tokens=67
            )
        
        monkeypatch.setattr(resources.chat.Completions, "create", lambda self, model, messages, max_tokens, temperature: gpt_response)
        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)

        def seeded_error(self, insertion, format):
            raise Exception("Database connection error.")
        
        monkeypatch.setattr(MockFlaskMysqlCursor, "execute", seeded_error)

        response = client.post("/translate", data=json.dumps({"text": text, "srcLang": srcLang, "toLang": toLang, "user_id": user_id}))
        response = response.json

        assert response["hasError"]
        assert "success" not in response
        assert "errorMessage" in response and response["errorMessage"] == "Database connection error."


    @pytest.mark.parametrize("text,srcLang,toLang,user_id", [("print('hello world!')", "python", "java", 1)])
    def test_api_connection_error(self, client, text, srcLang, toLang, user_id, monkeypatch):
        choices = [MockGpt.completion_choice_builder(
            finish_reason="stop",
            index=0,
            logprobs=None,
            content="System.out.println(\"hello world!\");",
            role="assistant",
            function_call=None,
            tool_calls=None
            )]
        
        gpt_response = MockGpt.completion_response_builder(
            choices=choices,
            id="chatcmpl-925pb878hKeuj7abfDnQmKEezr05I",
            created=1710286099,
            model="gpt-3.5-turbo-0125",
            object="chat.completion",
            system_fingerprint="fp_abcd123456",
            completion_tokens=7,
            prompt_tokens=60,
            total_tokens=67
            )
        
        def seeded_error(self, model, messages, max_tokens, temperature):
            raise Exception("GPT API connection error.")
        
        monkeypatch.setattr(resources.chat.Completions, "create", seeded_error)

        monkeypatch.setattr(MySQL, "connection", MockFlaskMysqlConnection)
        

        response = client.post("/translate", data=json.dumps({"text": text, "srcLang": srcLang, "toLang": toLang, "user_id": user_id}))
        response = response.json

        assert response["hasError"]
        assert "success" not in response
        assert "errorMessage" in response and response["errorMessage"] == "GPT API connection error."