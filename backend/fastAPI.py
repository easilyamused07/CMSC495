import openai
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import openai
import time

app = FastAPI()

def get_openai_generator(prompt: str):
    openai_stream = openai.ChatCompletion.create(
        #model="gpt-3.5-turbo",
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0,
        stream=True,
    )
    for event in openai_stream:
        if "content" in event["choices"][0].delta:
            current_response = event["choices"][0].delta.content
            yield "data: " + current_response + "\n\n"

@app.get('/stream')
async def stream():
    return StreamingResponse(get_openai_generator(prompt), media_type='text/event-stream')

