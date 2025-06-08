// src/components/OpenAIComponent.js

import React, { useState } from 'react';
import { getOpenAIResponse } from '../services/openaiService.ts';

const OpenAIComponent = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const aiResponse = await getOpenAIResponse(input);
    setResponse(aiResponse ? aiResponse : 'Error');
    //setResponse(aiResponse.choices[0].text);
  };

  return (
    <div>
      <h1>OpenAI Integration with React</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // rows="5"
          // cols="50"
          rows={5}
          cols={50}
          placeholder="Type your prompt here..."
        />
        <br />
        <button type="submit">Get Response</button>
      </form>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default OpenAIComponent;