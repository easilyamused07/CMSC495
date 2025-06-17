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
      <h1>AI First Aid Assistant</h1>
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
        <p>
          For more official guidance, visit the{' '}
          <a
            href="https://www.redcross.org/content/dam/redcross/training-services/course-fact-sheets/RTE-Textbook-Sample.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Red Cross First Aid Steps
          </a>.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'gray' }}>
          <strong>Disclaimer:</strong> This app is not a substitute for professional medical advice. Always seek the guidance of a qualified healthcare provider for serious injuries or emergencies.
        </p>
      </div>

    </div>
  );
};

export default OpenAIComponent;
