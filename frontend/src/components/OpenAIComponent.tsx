// frontend/src/OpenAIComponent.tsx

import React, { useState } from 'react';
import { getOpenAIResponse } from '../services/openaiService.ts';

const OpenAIComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const aiResponse = await getOpenAIResponse(prompt);
    setResponse(aiResponse ? aiResponse : 'Error');
  };

  return (
    <div>
      <h1>OpenAI Integration with React</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          cols={50}
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
