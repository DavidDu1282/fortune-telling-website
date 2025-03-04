// src/api/tarotApi.js
const API_URL = import.meta.env.VITE_API_URL || "";

export const analyzeDraw = async (drawnCards, spread, context, sessionId, language, updateCallback) => {
  const selectedCards = drawnCards.map((card) => ({
    name: card.name,
    orientation: card.orientation,
  }));

  try {
    const response = await fetch(`${API_URL}/api/tarot/analyze`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        spread: spread,
        tarot_cards: selectedCards,
        user_context: context,
        language: language
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
    }

    if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isDone = false;

    while (!isDone) {
        const { value, done } = await reader.read();
        isDone = done;
        if (value) {
            const decodedChunk = decoder.decode(value, { stream: !done });
            if (updateCallback) {
                updateCallback(decodedChunk);
            }
        }
    }

  } catch (error) {
    console.error("Error analyzing tarot draw:", error);
    if (updateCallback) {
      updateCallback(`Error: ${error.message}`);
    }
    throw error;
  }
};
