// Main Component (TarotReader.jsx)
import React, { useState, useEffect } from "react";
import Header from "./Header";
import SpreadSelector from "./SpreadSelector";
import QuestionInput from "./QuestionInput";
import CardDisplay from "./CardDisplay";
import AnalysisButton from "./AnalysisButton";
import AnalysisResult from "./AnalysisResult";
import { fetchTarotDeck } from "./api";
import { spreads } from "./spreads.js"

const TarotReader = () => {
  const [spread, setSpread] = useState("three_card");
  const [context, setContext] = useState("");
  const [tarotDeck, setTarotDeck] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [response, setResponse] = useState("");
  const [detailedAnalysis, setDetailedAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("zh");

  useEffect(() => {
    const loadDeck = async () => {
      const deck = await fetchTarotDeck();
      setTarotDeck(deck);
    };
    loadDeck();
  }, []);

  const drawCards = async () => {
    if (!tarotDeck.length) return;
    const count = spreads[spread].count;
    const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledDeck.slice(0, count).map((card) => ({
      ...card,
      orientation: Math.random() > 0.5 ? 'upright' : 'reversed',
    }));
    setDrawnCards(selectedCards);
    setRevealedCards([]);

    selectedCards.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCards((prev) => [...prev, index]);
        if (index === selectedCards.length - 1) {
          analyzeDraw(selectedCards);
        }
      }, index * 500);
    });
  };

  const analyzeDraw = async (selectedCards) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/tarot/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "unique-session-id",
          spread: spreads[spread].label[language],
          tarot_cards: selectedCards,
          user_context: context,
          language: language,
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

  const revealCardsSequentially = (cards) => {
    cards.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCards((prev) => [...prev, index]);
      }, index * 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
      <div className="container mx-auto p-6 relative">
        <Header language={language} setLanguage={setLanguage} />
        <SpreadSelector spread={spreads[spread].label[language]} setSpread={setSpread} language={language} />
        <QuestionInput context={context} setContext={setContext} language={language} />
        <button onClick={drawCards} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transform hover:scale-105 transition-transform duration-300\">
          {language === "zh" ? "抽牌" : "Draw Cards"}
        </button>
        <CardDisplay drawnCards={drawnCards.map((card) => ({ ...card, orientation: Math.random() > 0.5 ? 'upright' : 'reversed' }))} revealedCards={revealedCards} language={language} />
        {revealedCards.length === spreads[spread].count && (
          <AnalysisButton
            drawnCards={drawnCards}
            revealedCards={revealedCards}
            spread={spreads[spread].label[language]}
            context={context}
            language={language}
            setResponse={setResponse}
            setDetailedAnalysis={setDetailedAnalysis}
            setLoading={setLoading}
          />
        )}
        {response && (
          <AnalysisResult
            response={response}
            detailedAnalysis={detailedAnalysis}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default TarotReader;
