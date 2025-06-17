// frontend/src/components/OpenAIComponent.tsx

import React, { useState } from 'react';
import { getOpenAIResponse } from '../services/openaiService.ts';
import './OpenAIComponent.css';

const OpenAIComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setResponse('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setResponse('');
    try {
      const aiResponse = await getOpenAIResponse(prompt);
      setResponse(aiResponse || 'Error');
    } catch (err) {
      setResponse('Error fetching response.');
    } finally {
      setLoading(false);
    }
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
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Response'}
        </button>
      </form>

      {loading && (
        <div className="spinner-container">
          <div className="spinner" data-testid="spinner"/>
          <p>Please wait while we process your request...</p>
        </div>
      )}

      {!loading && response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}

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
  );
};

export default OpenAIComponent;
