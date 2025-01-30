import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const TarotReader = () => {
  const [spread, setSpread] = useState("three_card");
  const [context, setContext] = useState("");
  const [tarotDeck, setTarotDeck] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [response, setResponse] = useState("");
  const [detailedAnalysis, setDetailedAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("zh"); // Language state: 'zh' for Chinese, 'en' for English

  const API_URL = import.meta.env.VITE_API_URL || "";

  const spreads = {
    three_card: { label: { zh: "三张牌阵 (过去，现在，未来)", en: "Three-Card Spread (Past, Present, Future)" }, count: 3 },
    celtic_cross: { label: { zh: "凯尔特十字牌阵", en: "Celtic Cross" }, count: 10 },
    custom: { label: { zh: "自定义 (5 张牌)", en: "Custom (5 cards)" }, count: 5 },
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
    revealCardsSequentially(shuffledDeck.slice(0, count));
  };

  const revealCardsSequentially = (cards) => {
    cards.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCards((prev) => [...prev, index]);
      }, index * 500); // 500ms delay per card
    });
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
          spread: spreads[spread].label[language],
          tarot_cards: selectedCards,
          user_context: context,
          language: language, // Pass the selected language to the backend
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

  const getSparkleEffect = (index) => {
    if (revealedCards.includes(index)) {
      return "animate-sparkle-big";
    }
    return "animate-sparkle-small";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
      <div className="container mx-auto p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            {language === "zh" ? "塔罗牌阅读器" : "Tarot Reader"}
          </h1>
          <button
            onClick={() => setLanguage((prevLanguage) => (prevLanguage === "zh" ? "en" : "zh"))}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            {language === "zh" ? "切换为英语" : "Switch to Chinese"}
          </button>
        </div>

        {/* Spread Selection */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            {language === "zh" ? "选择一个牌阵:" : "Choose a spread:"}
          </label>
          <select
            value={spread}
            onChange={(e) => setSpread(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
          >
            {Object.entries(spreads).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label[language]}
              </option>
            ))}
          </select>
        </div>

        {/* User Context */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">
            {language === "zh" ? "输入你的问题:" : "Enter your question:"}
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={language === "zh" ? "例如: 我会在事业上成功吗?" : "e.g., Will I succeed in my career?"}
            className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
          />
        </div>

        {/* Draw Cards Button */}
        <div className="mb-4">
          <button
            onClick={drawCards}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transform hover:scale-105 transition-transform duration-300"
          >
            {language === "zh" ? "抽牌" : "Draw Cards"}
          </button>
        </div>

        {/* Cards Display */}
        <div className="flex flex-wrap justify-center gap-6 my-8">
          {drawnCards.map((card, index) => (
            <div
              key={index}
              className={`relative w-40 h-60 cursor-pointer perspective-1000 ${getSparkleEffect(index)}`}
            >
              <div
                className={`w-full h-full transition-transform duration-700 ease-in-out transform ${
                  revealedCards.includes(index) ? "rotate-y-180" : "rotate-y-0"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute w-full h-full bg-indigo-800 text-gray-200 flex items-center justify-center rounded-lg shadow-lg border-2 border-indigo-900"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <p className="text-2xl font-bold">?</p>
                </div>

                <div
                  className="absolute w-full h-full bg-yellow-300 text-black flex flex-col items-center justify-center rounded-lg shadow-xl border-2 border-yellow-500"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={`/tarot/cards/${card.img}`}
                    alt={card.name}
                    className={`w-full h-40 object-cover rounded-t-lg ${
                      revealedCards.includes(index) && drawnCards[index].orientation === "reversed" ? "rotate-180" : ""
                    }`}
                    loading="lazy" />
                  <p className="mt-2 text-lg font-semibold">{card.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analyze Button */}
        {revealedCards.length === spreads[spread].count && (
          <div className="mt-8 text-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                analyzeDraw();
              }}
            >
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold rounded-md hover:from-green-500 hover:to-green-700 transform hover:scale-110 transition-transform duration-300 ease-in-out animate-pulse shadow-lg ring-4 ring-green-300 hover:ring-green-500"
              >
                {loading ? (language === "zh" ? "分析中..." : "Analyzing...") : (language === "zh" ? "分析牌阵" : "Analyze Draw")}
              </button>
            </form>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="mt-8 p-6 bg-white text-gray-800 rounded-lg shadow-lg transform transition-all duration-500 ease-out opacity-0 scale-95 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">
              {language === "zh" ? "你的塔罗分析" : "Your Tarot Analysis"}
            </h2>
            <ReactMarkdown className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">{response}</ReactMarkdown>
            <ReactMarkdown className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">{detailedAnalysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarotReader;
