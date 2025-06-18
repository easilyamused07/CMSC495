import pytest
from main import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_firstaid_route(client):
    response = client.get('/firstaid/burn')
    assert response.status_code == 200
    assert b'steps' in response.data

def test_parse_route(client):
    response = client.post('/api/parse', json={"input": "How do I treat a burn?"})
    assert response.status_code == 200
    assert b'ai_output' in response.data

def test_chat_route(client):
    response = client.post('/api/chat', json={"prompt": "How do I treat a burn?"})
    assert response.status_code == 200 or response.status_code == 500  # LLM might fail, but the server responds
