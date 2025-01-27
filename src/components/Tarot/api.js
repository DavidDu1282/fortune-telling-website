const API_URL = import.meta.env.VITE_API_URL || "";

export const fetchTarotDeck = async () => {
  try {
    // Append a timestamp to the URL to prevent caching issues
    const response = await fetch(`/tarot/optimized_tarot_translated.json?t=${new Date().getTime()}`, {
      mode: "cors", // Ensures proper handling for cross-origin requests
    });

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Retrieve the text content and log for debugging
    const text = await response.text();
    console.log("Fetched content:", text);

    // Parse the JSON data
    const data = JSON.parse(text);

    // Validate that the "cards" field exists
    if (!data.cards) {
      throw new Error("Invalid JSON structure: Missing 'cards' field");
    }

    return data.cards;
  } catch (error) {
    console.error("Error fetching tarot deck:", error.message);
    return [];
  }
};


export const analyzeDraw = async (drawnCards, revealedCards, spread, context, language) => {
  const selectedCards = revealedCards.map((index) => ({
    name: drawnCards[index].name,
    orientation: Math.random() > 0.5 ? "upright" : "reversed",
  }));

  try {
    const response = await fetch(`${API_URL}/api/tarot/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: "unique-session-id",
        spread,
        tarot_cards: selectedCards,
        user_context: context,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch analysis");
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing tarot draw:", error);
    return { message: "", summary: "" };
  }
};
