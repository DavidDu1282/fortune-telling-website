const API_URL = import.meta.env.VITE_API_URL || "";

export const fetchTarotDeck = async () => {
  try {
    const response = await fetch("/tarot/optimized_tarot.json");
    const data = await response.json();
    return data.cards;
  } catch (error) {
    console.error("Error fetching tarot deck:", error);
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
