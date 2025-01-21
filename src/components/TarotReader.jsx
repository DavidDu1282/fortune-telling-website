import React, { useState, useEffect } from "react";

const TarotReader = () => {
  const [spread, setSpread] = useState("three_card"); // Default spread
  const [context, setContext] = useState(""); // User's query
  const [tarotDeck, setTarotDeck] = useState([]); // Full tarot deck
  const [drawnCards, setDrawnCards] = useState([]); // Cards drawn for the spread
  const [revealedCards, setRevealedCards] = useState([]); // Revealed cards
  const [response, setResponse] = useState(""); // Backend message
  const [detailedAnalysis, setDetailedAnalysis] = useState(""); // Detailed analysis
  const [loading, setLoading] = useState(false); // Loading state

  const API_URL = import.meta.env.VITE_API_URL || ""; // Dynamic API URL

  const spreads = {
    three_card: { label: "Three-Card Spread (Past, Present, Future)", count: 3 },
    celtic_cross: { label: "Celtic Cross", count: 10 },
    custom: { label: "Custom (5 cards)", count: 5 },
  };

  // Fetch tarot deck on component mount
  useEffect(() => {
    const fetchTarotDeck = async () => {
      try {
        const response = await fetch("/tarot/optimized_tarot.json");
        const data = await response.json();
        setTarotDeck(data.cards);
      } catch (error) {
        console.error("Error fetching tarot deck:", error);
      }
    };

    fetchTarotDeck();
  }, []);

  // Shuffle and draw cards
  const drawCards = () => {
    if (!tarotDeck.length) return;
    const count = spreads[spread].count;
    const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
    setDrawnCards(shuffledDeck.slice(0, count));
    setRevealedCards([]); // Reset revealed cards
  };

  // Reveal a card
  const revealCard = (index) => {
    if (!revealedCards.includes(index) && revealedCards.length < spreads[spread].count) {
      setRevealedCards([...revealedCards, index]);
    }
  };

  // Analyze revealed cards
  const analyzeDraw = async () => {
    setLoading(true);
    try {
      const selectedCards = revealedCards.map((index) => ({
        name: drawnCards[index].name,
        orientation: Math.random() > 0.5 ? "upright" : "reversed",
      }));

      const response = await fetch(`${API_URL}/api/tarot/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "unique-session-id",
          tarot_cards: selectedCards,
          user_context: context,
        }),
      });

      const result = await response.json();
      setResponse(result.message); // Backend message
      setDetailedAnalysis(result.summary); // Detailed analysis
    } catch (error) {
      console.error("Error analyzing tarot draw:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-indigo-900 text-gray-100">
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold text-center mb-6">Tarot Reader</h1>
  

{/* 
    // <div className="max-w-4xl mx-auto p-4">
    //   <h1 className="text-3xl font-bold text-center mb-4">Tarot Reader</h1> */}

      {/* Spread Selection */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Choose a spread:</label>
        <select
          value={spread}
          onChange={(e) => setSpread(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          {Object.entries(spreads).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      {/* User Context */}
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Enter your question:</label>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., Will I succeed in my career?"
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Draw Cards Button */}
      <div className="mb-4">
        <button
          onClick={drawCards}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Draw Cards
        </button>
      </div>

      {/* Cards Display */}
      <div className="grid grid-cols-3 gap-4">
        {drawnCards.map((card, index) => (
          <div
          key={index}
          onClick={() => revealCard(index)}
          className={`relative w-40 h-60 flex items-center justify-center rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
            revealedCards.includes(index) ? "bg-white shadow-lg" : "bg-indigo-800"
          }`}
        >
          {revealedCards.includes(index) ? (
            <div className="text-center">
              <img
                src={`/tarot/cards/${card.img}`}
                alt={card.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <p className="mt-2 text-lg font-semibold text-gray-800">{card.name}</p>
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-200">?</p>
          )}
        </div>
        ))}
      </div>

      {/* Analyze Button */}
      {revealedCards.length === spreads[spread].count && (
        <form
        onSubmit={(e) => {
          e.preventDefault();
          analyzeDraw();
        }}
      >
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          {loading ? "Analyzing..." : "Analyze Draw"}
        </button>
      </form>
      )}

      {/* Response */}
      {response && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md">
          <h2 className="text-lg font-bold mb-2">Analysis Result:</h2>
          <p className="font-medium mb-2">{response}</p>
          <p>{detailedAnalysis}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default TarotReader;
