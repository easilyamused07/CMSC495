from flask import Flask, jsonify, request
from flask_cors import CORS
import json
#import requests
import os
from dotenv import load_dotenv
import openai

#load_dotenv()
# Setup the OpenAI client to use either Azure, OpenAI.com, or Ollama API
load_dotenv(override=True)
API_HOST = os.getenv("API_HOST", "ollama")


if API_HOST == "ollama":
    client = openai.OpenAI(base_url=os.environ["OLLAMA_ENDPOINT"], api_key="nokeyneeded")
    MODEL_NAME = os.environ["OLLAMA_MODEL"]
elif API_HOST == "github":
    client = openai.OpenAI(base_url="https://models.inference.ai.azure.com", api_key=os.environ["GITHUB_TOKEN"])
    MODEL_NAME = os.getenv("GITHUB_MODEL", "gpt-4o")
else:
    client = openai.OpenAI(api_key=os.environ["OPENAI_KEY"])
    MODEL_NAME = os.environ["OPENAI_MODEL"]



app = Flask(__name__)
CORS(app)

#EXA_API_KEY = os.getenv("EXA_API_KEY")

messages = [
    {"role": "system", "content": "I am a large language model."},
]

@app.route("/firstaid/<injury>", methods=["GET"])
def get_first_aid(injury):
    with open("data/first_aid.json") as f:
        data = json.load(f)
    response = data.get(injury.lower(), {"steps": ["No information found for this injury."]})
    return jsonify(response)

@app.route('/api/parse', methods=['POST'])
def parse_injury():
    while True:
        question = input("\nYour question: ")
        print("Sending question...")

        messages.append({"role": "user", "content": question})
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=1,
            max_tokens=400,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None,
            stream=True,
        )

        print("\nAnswer: ")
        bot_response = ""
        for event in response:
            if event.choices and event.choices[0].delta.content:
                content = event.choices[0].delta.content
                print(content, end="", flush=True)
                bot_response += content
        print("\n")
        messages.append({"role": "assistant", "content": bot_response})

    #except Exception as e:
    #    print("Error during AI parsing:", e)
    #    return jsonify({"ai_output": ["AI parsing failed."]})

@app.route('/completions', methods=['POST'])
def chatBot():

    print("Sending question...")
    data = request.get_json()
    input_text = data.get("prompt", "")

    messages.append({"role": "user", "content": input_text})
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        temperature=1,
        max_tokens=400,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=True,
    )

    print("\nAnswer: ")
    bot_response = ""
    for event in response:
        if event.choices and event.choices[0].delta.content:
            content = event.choices[0].delta.content
            print(content, end="", flush=True)
            bot_response += content
    print("\n")
    messages.append({"role": "assistant", "content": bot_response})
    return bot_response

    #except Exception as e:
    #    print("Error during AI parsing:", e)
    #    return jsonify({"ai_output": ["AI parsing failed."]})

if __name__ == "__main__":
    app.run(debug=True)
