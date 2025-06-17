from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import requests
import os
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
from dotenv import load_dotenv

# This is our original main file and will be retained until deemed unnecessary after full testing of localllm.py
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


EXA_API_KEY = os.getenv("EXA_API_KEY")

@app.route("/firstaid/<injury>", methods=["GET"])
def get_first_aid(injury):
    with open(os.path.join(BASE_DIR, "data", "first_aid.json")) as f:
        data = json.load(f)
    response = data.get(injury.lower(), {"steps": ["No information found for this injury."]})
    return jsonify(response)

@app.route('/api/parse', methods=['POST'])
def parse_injury():
    data = request.get_json()
    input_text = data.get("input", "")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {EXA_API_KEY}"
    }

    payload = {
        "query": input_text,
        "num_results": 1
    }

    try:
        response = requests.post("https://api.exa.ai/search", headers=headers, json=payload)
        response.raise_for_status()
        json_data = response.json()

        # Extract relevant keyword — use 'autopromptString' or extract from title
        inferred_term = json_data.get("autopromptString", "").lower().strip()

        # Load first aid data
        with open("data/first_aid.json") as f:
            aid_data = json.load(f)

        # Try direct match
        steps = aid_data.get(inferred_term, {}).get("steps")

        # If no match, try simple fuzzy match (substring)
        if not steps:
            for key in aid_data:
                if inferred_term in key or key in inferred_term:
                    steps = aid_data[key].get("steps")
                    break

        # If still nothing found
        if not steps:
            steps = ["No first aid steps found for that injury."]

        return jsonify({"ai_output": steps})

    except Exception as e:
        print("Error during AI parsing:", e)
        return jsonify({"ai_output": ["AI parsing failed."]})


if __name__ == "__main__":
    app.run(debug=True)