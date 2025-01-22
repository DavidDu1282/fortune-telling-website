import React, { useState, useEffect } from "react";

const TarotReader = () => {
  const [spread, setSpread] = useState("three_card");
  const [context, setContext] = useState("");
  const [tarotDeck, setTarotDeck] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [response, setResponse] = useState("");
  const [detailedAnalysis, setDetailedAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const spreads = {
    three_card: { label: "Three-Card Spread (Past, Present, Future)", count: 3 },
    celtic_cross: { label: "Celtic Cross", count: 10 },
    custom: { label: "Custom (5 cards)", count: 5 },
  };

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

  const drawCards = () => {
    if (!tarotDeck.length) return;
    const count = spreads[spread].count;
    const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
    setDrawnCards(shuffledDeck.slice(0, count));
    setRevealedCards([]);
  };

  const revealCard = (index) => {
    if (!revealedCards.includes(index) && revealedCards.length < spreads[spread].count) {
      setRevealedCards([...revealedCards, index]);
    }
  };

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
      setResponse(result.message);
      setDetailedAnalysis(result.summary);
    } catch (error) {
      console.error("Error analyzing tarot draw:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          Tarot Reader
        </h1>

        {/* Spread Selection */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Choose a spread:</label>
          <select
            value={spread}
            onChange={(e) => setSpread(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
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
            className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        {/* Draw Cards Button */}
        <div className="mb-4">
          <button
            onClick={drawCards}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transform hover:scale-105 transition-transform duration-300"
          >
            Draw Cards
          </button>
        </div>

        {/* Cards Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {drawnCards.map((card, index) => (
            <div
            key={index}
            onClick={() => revealCard(index)}
                className={`relative w-40 h-60 flex items-center justify-center rounded-lg cursor-pointer transform-gpu perspective-1000 transition-transform duration-1000 ease-in-out hover:scale-105 ${
                revealedCards.includes(index)
                    ? "rotate-y-180 bg-yellow-300 border-yellow-500 shadow-xl ring-4 ring-yellow-400"
                    : "rotate-y-0 bg-indigo-800 border-indigo-900 shadow-lg ring-2 ring-indigo-400"
                }`}
                style={{
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                }}
            >
            {revealedCards.includes(index) ? (
              <div
                className="absolute w-full h-full flex flex-col items-center justify-center transform rotate-y-180"
                style={{ backfaceVisibility: "hidden" }}
              >
                <img
                    src={`/tarot/cards/${card.img}`}
                    alt={card.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                />
                <p className="mt-2 text-lg font-semibold text-black">{card.name}</p>
              </div>
            ) : (
              <div
                className="absolute w-full h-full flex items-center justify-center transform rotate-y-0"
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-2xl font-bold text-gray-200">?</p>
              </div>
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
                onClick={analyzeDraw}
                className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold rounded-md hover:from-green-500 hover:to-green-700 transform hover:scale-110 transition-transform duration-300 ease-in-out animate-pulse shadow-lg ring-4 ring-green-300 hover:ring-green-500"
            >
                {loading ? "Analyzing..." : "Analyze Draw"}
            </button>

          </form>
        )}

        {/* Response */}
        {response && (
            <div className="mt-8 p-6 bg-white text-gray-800 rounded-lg shadow-lg transform transition-all duration-500 ease-out opacity-0 scale-95 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Your Tarot Analysis</h2>
                <p className="font-medium mb-4">{response}</p>
                <p>{detailedAnalysis}</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default TarotReader;
