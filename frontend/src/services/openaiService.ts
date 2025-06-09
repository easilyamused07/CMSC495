// src/openaiService.js

// This function sends a fetch to the /completions route but needs to be updated to pull the model value from .env
export const getOpenAIResponse = async (prompt) => {
//   const response = await openai.post('/completions', {
//     model: 'llama3.2',
//     prompt: prompt,
//     max_tokens: 100,
//   });
//   return response.data;

    try {
    const aiRes = await fetch('/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model: 'llama3.2',
        prompt: prompt,
        max_tokens: 100
       }),
    }).then((response) => {
        if (!response.ok) throw new Error('AI parsing failed');
        return response.text();
    }).then((data) => {
        return(data)
    });

    return aiRes

    // const aiData = await aiRes.json();

    // if (aiData && aiData.ai_output) return aiData.ai_output;
    // if (aiData && aiData.data) return aiData.data;
  } catch (err) {
    console.warn('Fail:', err);
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
}

