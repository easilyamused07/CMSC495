// src/openaiService.ts

// This function sends a fetch to the /completions route but needs to be updated to pull the model value from .env
export const getOpenAIResponse = async (prompt: string) => {
//   const response = await openai.post('/completions', {
//     model: 'llama3',
//     prompt: prompt,
//     max_tokens: 100,
//   });
//   return response.data;

  try {
    console.log('Sending request:', prompt);

    const aiRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt }),
    });

    console.log('Response status:', aiRes.status);

        // Check if the response is ok
    if (!aiRes.ok) {
      console.error('HTTP Error:', aiRes.status, aiRes.statusText);
      return `Error: ${aiRes.status} ${aiRes.statusText}`;
    }

    // Parse the JSON response
    const aiData = await aiRes.json();
    console.log('API returned:', aiData);

    // Return the response from our backend
    if (aiData && aiData.response) return aiData.response;
    if (aiData && aiData.error) return `Backend Error: ${aiData.error}`;

    // Legacy support for classmates' original code structure:
    // if (aiData && aiData.ai_output) return aiData.ai_output;
    // if (aiData && aiData.data) return aiData.data;

    return "No valid response received.";

  } catch (err) {
    console.warn('Fail:', err);
    return "AI call failed.";
  }
};

export async function parseWithAIOrFallback(input: string) {
  try {
    const aiRes = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });

    if (!aiRes.ok) throw new Error('AI parsing failed');

    const aiData = await aiRes.json();
    if (aiData && aiData.ai_output) return aiData.ai_output;
  } catch (err) {
    console.warn('Falling back to keyword search:', err);
  }

//   const fallbackRes = await fetch(`/firstaid/${encodeURIComponent(input)}`);
//   if (!fallbackRes.ok) throw new Error('Fallback also failed');
//   const fallbackData = await fallbackRes.json();
//   return fallbackData.steps || ["Sorry, no instructions found."];

  try {
    const fallbackRes = await fetch(`/firstaid/${encodeURIComponent(input)}`);
    if (!fallbackRes.ok) throw new Error('Fallback also failed');
    const fallbackData = await fallbackRes.json();
    return fallbackData.steps || ["Sorry, no instructions found."];
  } catch (err) {
    console.error('Final fallback failed:', err);
    return ["Sorry, no instructions found."];
  }
}
