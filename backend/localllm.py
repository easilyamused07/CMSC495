#import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from dotenv import load_dotenv
import openai

load_dotenv(override=True)
API_HOST = os.getenv("API_HOST", "ollama")


def get_model_name():
    model_name = os.getenv("OLLAMA_MODEL", "llama3")
    if model_name != "llama3":
        return "llama3"
    return model_name

MODEL_NAME = get_model_name()

def is_first_aid_related(message: str) -> bool:
    first_aid_keywords = [
        "bleeding", "burn", "CPR", "choking", "cut", "emergency", "fracture", "first aid",
        "unconscious", "rescue breathing", "allergic reaction", "sprain", "wound", "trauma",
        "shock", "heart attack", "heat stroke", "hypothermia", "seizure"
    ]
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in first_aid_keywords)



if API_HOST == "ollama":
    REQUIRED_ENV_VARS = ["OLLAMA_ENDPOINT", "OLLAMA_MODEL"]

    for var in REQUIRED_ENV_VARS:
        if var not in os.environ:
            raise EnvironmentError(f"Missing required environment variable: {var}")

    client = openai.OpenAI(base_url=os.environ["OLLAMA_ENDPOINT"], api_key="nokeyneeded")
    MODEL_NAME = os.environ["OLLAMA_MODEL"]

elif API_HOST == "github":
    client = openai.OpenAI(base_url="https://models.inference.ai.azure.com", api_key=os.environ["GITHUB_TOKEN"])
    MODEL_NAME = os.getenv("GITHUB_MODEL", "gpt-4o")
elif API_HOST == "exa":
    client = openai.OpenAI(base_url="https://models.inference.ai.azure.com", api_key=os.environ["EXA_API_KEY"])
    MODEL_NAME = os.getenv("EXA_MODEL", "exa") # TODO: confirm validity of this model name for OpenAI calls
else:
    client = openai.OpenAI(api_key=os.environ["OPENAI_KEY"])
    MODEL_NAME = os.environ["OPENAI_MODEL"]



app = Flask(__name__)
CORS(app)

messages = [
    {"role": "system", "content": "I am a large language model."},
]

# This route is not currently in use but is being retained for Exa routing
@app.route("/firstaid/<injury>", methods=["GET"])
def get_first_aid(injury):
    with open("data/first_aid.json") as f:
        data = json.load(f)
    response = data.get(injury.lower(), {"steps": ["No information found for this injury."]})
    return jsonify(response)

# This route is not currently in use but is being retained for Exa routing
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

# This route creates an openai chat completion and allows dialog with the bot
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

@app.route('/api/chat', methods=['POST'])
def chat_with_llama():
    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        try:
            local_messages
        except NameError:
            # Initialize local_messages if it doesn't exist
            local_messages = [
                {"role": "system", "content": "You are a helpful assistant who provides first aid steps to answer questions about minor injuries."}
            ]
        
        if not user_message:
            return jsonify({"error": "Message cannot be empty."}), 400

        local_messages.append({"role": "user", "content": user_message}) #Added
        #if not is_first_aid_related(user_message):
        #    return jsonify({
        #        "response": "I'm a first aid assistant. Please ask about medical emergencies like burns, cuts, choking, CPR, injuries, or other health emergencies."
        #    }), 200

        model_name = get_model_name()

        response = client.chat.completions.create(
            model=model_name,  
            messages=local_messages,
            temperature=0.7,
            max_tokens=400,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            stream=True,
        )

        result = ""
        for event in response:
            if event.choices and event.choices[0].delta.content:
                result += event.choices[0].delta.content

        messages.append({"role": "assistant", "content": result})
        print("💬 AI Final Response:", result)
        return jsonify({"response": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

