// Main Component (TarotReader.jsx)
import React, { useState, useEffect } from "react";
import Header from "./Header";
import SpreadSelector from "./SpreadSelector";
import QuestionInput from "./QuestionInput";
import CardDisplay from "./CardDisplay";
import AnalysisButton from "./AnalysisButton";
import AnalysisResult from "./AnalysisResult";
import { fetchTarotDeck } from "./api";
import { spreads } from "./Spreads";

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
  const [manualMode, setManualMode] = useState(false);
  const [manualCards, setManualCards] = useState([]);

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

  const handleManualCardChange = (index, field, value) => {
    const updatedCards = [...manualCards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value,
    };
    setManualCards(updatedCards);
  };

  const handleAnalyzeManual = () => {
    if (manualCards.length === spreads[spread].count) {
      analyzeDraw(manualCards);
    } else {
      alert(language === "zh" ? "请填写所有卡牌信息" : "Please fill out all card information.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
      <div className="container mx-auto p-6 relative">
        <Header language={language} setLanguage={setLanguage} />
        <SpreadSelector spread={spreads[spread].label[language]} setSpread={setSpread} language={language} />
        <QuestionInput context={context} setContext={setContext} language={language} />

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            {language === "zh" ? "选择模式:" : "Choose Mode:"}
          </label>
          <button
            onClick={() => setManualMode((prev) => !prev)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            {manualMode ? (language === "zh" ? "切换到自动抽牌" : "Switch to Auto Draw") : (language === "zh" ? "切换到手动输入" : "Switch to Manual Input")}
          </button>
        </div>

        {manualMode ? (
          <div>
            {Array.from({ length: spreads[spread].count }).map((_, index) => (
              <div key={index} className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  {language === "zh" ? `卡牌 ${index + 1}` : `Card ${index + 1}`}:
                </label>
                <select
                  onChange={(e) => handleManualCardChange(index, "name", e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
                >
                  <option value="">
                    {language === "zh" ? "选择卡牌" : "Select Card"}
                  </option>
                  {tarotDeck.map((card) => (
                    <option key={card.name} value={card.name}>
                      {card.name}
                    </option>
                  ))}
                </select>
                <select
                  onChange={(e) => handleManualCardChange(index, "orientation", e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 mt-2"
                >
                  <option value="">
                    {language === "zh" ? "选择方向" : "Select Orientation"}
                  </option>
                  <option value="upright">
                    {language === "zh" ? "正位" : "Upright"}
                  </option>
                  <option value="reversed">
                    {language === "zh" ? "逆位" : "Reversed"}
                  </option>
                </select>
              </div>
            ))}
            <button
              onClick={handleAnalyzeManual}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
            >
              {language === "zh" ? "分析牌阵" : "Analyze Spread"}
            </button>
          </div>
        ) : (
          <div>
            <button onClick={drawCards} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transform hover:scale-105 transition-transform duration-300">
              {language === "zh" ? "抽牌" : "Draw Cards"}
            </button>
            <CardDisplay drawnCards={drawnCards.map((card) => ({ ...card, orientation: Math.random() > 0.5 ? 'upright' : 'reversed' }))} revealedCards={revealedCards} language={language} />
          </div>
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
