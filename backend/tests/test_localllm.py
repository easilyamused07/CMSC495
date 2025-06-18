import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import localllm

# Dummy class to simulate OpenAI streaming response objects
class DummyDelta:
    def __init__(self, content):
        self.content = content

class DummyChoice:
    def __init__(self, content):
        self.delta = DummyDelta(content)

class DummyEvent:
    def __init__(self, content):
        self.choices = [DummyChoice(content)]

class DummyStream:
    def __init__(self, content="Hello World"):
        self.content = content

    def __iter__(self):
        yield DummyEvent(self.content)


@pytest.fixture
def client():
    app = localllm.app
    app.config["TESTING"] = True
    return app.test_client()

def test_chatBot(monkeypatch, client):
    monkeypatch.setattr(
        localllm.client.chat.completions, "create",
        lambda **kwargs: DummyStream("I'm a first aid assistant")
    )
    response = client.post("/completions", json={"prompt": "Hi"})
    assert response.status_code == 200
    text = response.get_data(as_text=True)
    assert "I'm a first aid assistant" in text


def test_chat_with_llama_success(monkeypatch, client):
    monkeypatch.setattr(
        localllm.client.chat.completions, "create",
        lambda **kwargs: DummyStream("Oh no, I'm so sorry to hear that! ")
    )
    response = client.post("/api/chat", json={"message": "I have a burn on my hand"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["response"] == "Oh no, I'm so sorry to hear that! "


def test_chat_with_llama_empty(client):
    response = client.post("/api/chat", json={"message": ""})
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

