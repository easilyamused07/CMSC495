import React, { useState } from 'react';
import { parseWithAIOrFallback } from '../services/api.ts';

// This is the original form that was used with the Exa interactions and will be retained until deemed unnecessary
const InjuryForm = () => {
  const [injury, setInjury] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [llmOutput, setllmOutput] = useState("Waiting for data ...");

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetchFirstAid(injury);
      setSteps(result.steps || ["No steps found."]);
    } catch (err) {
      console.error('Manual search error:', err);
      setSteps(["An error occurred. Please try again later."]);
    }
  };

  const handleAIParse = async () => {
    try {
      const parsedSteps = await parseWithAIOrFallback(injury);
      setSteps(parsedSteps);
    } catch (err) {
      console.error('AI parsing error:', err);
      setSteps(["An error occurred. Please try again later."]);
    }
  };

  return (
    <form onSubmit={handleManualSubmit} className="space-y-4">
      <input
        type="text"
        value={injury}
        onChange={(e) => setInjury(e.target.value)}
        placeholder="Describe the injury (e.g., 'My friend has a deep cut')"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <div className="flex space-x-2">
        <button type="button" onClick={handleAIParse} className="bg-green-500 text-white px-4 py-2 rounded">
          Use AI to Parse
        </button>
      </div>
      <ul className="list-disc list-inside mt-4">
        {steps.map((step, index) => <li key={index}>{step}</li>)}
      </ul>
      <div
        style={{
          fontSize: "2rem",
          padding: "2rem 0rem 0rem 2rem",
          color: "black",
        }}
      >
        Name: {llmOutput}
      </div>
    </form>
  );
};

export default InjuryForm;
