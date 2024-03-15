import pytest
from Tests.Mocks.MockFlaskMysql import MockFlaskMysqlConnection, MockFlaskMysqlCursor
import Tests.Mocks.MockGptApi as MockGpt
from app import create_app
import json
from flask_mysqldb import MySQL
from mock import Mock
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
    
    @pytest.mark.parametrize("text,srcLang,toLang", [("print('hello world!')", "python", "java")])
    def test_user_registration_success(self, client, text, srcLang, toLang, monkeypatch):
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


        response = client.post("/translate", data=json.dumps({"text": text, "srcLang": srcLang, "toLang": toLang}))
        response = response.json

        assert response["success"]
        assert not response["hasError"]
        assert "output" in response
        assert response["output"] == "System.out.println(\"hello world!\");"