import sys
import os
import json

# Allow importing from backend/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from backend.main import app

def test_manual_lookup_unknown():
    client = app.test_client()
    response = client.get("/firstaid/unknowninjury")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "steps" in data
    assert data["steps"] == ["No information found for this injury."]

def test_ai_parse_empty_input():
    client = app.test_client()
    response = client.post("/api/parse", json={"input": ""})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "ai_output" in data
