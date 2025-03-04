// src/api/tarotApi.js
const API_URL = import.meta.env.VITE_API_URL || "";

export const analyzeDraw = async (drawnCards, spread, context, sessionId, language) => { // Added language

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
        language: language // Include language
      }),
    });

    if (!response.ok) {
      // Improved error handling (consistent with hook)
      const errorData = await response.json(); // Try to get JSON error
      throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing tarot draw:", error);
    throw error; // Re-throw for consistent handling
  }
};