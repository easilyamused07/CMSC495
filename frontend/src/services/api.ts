// This function handles the original parse action using Exa
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

  const fallbackRes = await fetch(`/firstaid/${encodeURIComponent(input)}`);
  if (!fallbackRes.ok) throw new Error('Fallback also failed');
  const fallbackData = await fallbackRes.json();
  return fallbackData.steps || ["Sorry, no instructions found."];
}
