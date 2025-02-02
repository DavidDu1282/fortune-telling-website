import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import SpreadSelector from "./SpreadSelector";
import QuestionInput from "./QuestionInput";
import CardDisplay from "./CardDisplay";
import AnalysisButton from "./AnalysisButton";
import AnalysisResults from "./AnalysisResults";
import LoadingIndicator from "./LoadingIndicator";
import ManualCardInput from "./ManualCardInput";
import { fetchTarotDeck } from "./api";
import { spreads } from "./Spreads";

const TarotReader = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation(); // Get current language

  const [spread, setSpread] = useState("three_card");
  const [context, setContext] = useState("");
  const [tarotDeck, setTarotDeck] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [response, setResponse] = useState("");
  const [detailedAnalysis, setDetailedAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualCards, setManualCards] = useState([]);

  useEffect(() => {
    document.title = t("tarot_title"); // Use translated title
    const loadDeck = async () => {
      const deck = await fetchTarotDeck();
      setTarotDeck(deck);
    };
    loadDeck();
  }, [t]);

  const drawCards = async () => {
    if (!tarotDeck.length) return;
    const count = spreads[spread].count;
    const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledDeck.slice(0, count).map((card) => ({
      ...card,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
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
      const requestBody = {
        session_id: "unique-session-id", // Ensure session ID is always included
        spread: spreads[spread].label[i18n.language], // Send full label
        tarot_cards: selectedCards.map((card) => ({
          name: card.name, // Ensure it's the correct field name
          orientation: card.orientation // Ensure it's "upright" or "reversed"
        })),
        user_context: context,
        language: i18n.language // Send correct language
      };
  
      console.log("Sending API Request:", requestBody); // Debugging
  
      const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/tarot/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
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
    <HelmetProvider>
      <Helmet>
        <title>{t("tarot_title")}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
        <div className="container mx-auto p-6 relative">
          <Header />

          <SpreadSelector spread={spreads[spread].label[i18n.language]} setSpread={setSpread} />
          <QuestionInput context={context} setContext={setContext} />

          <div className="mb-4">
            <button onClick={() => setManualMode((prev) => !prev)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
              {manualMode ? t("tarot_switch_to_auto") : t("tarot_switch_to_manual")}
            </button>
          </div>

          {manualMode ? (
            <ManualCardInput
              tarotDeck={tarotDeck}
              spread={spreads[spread].count}
              manualCards={manualCards}
              setManualCards={setManualCards}
              analyzeDraw={analyzeDraw}
            />
          ) : (
            <>
              <button onClick={drawCards} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
                {t("tarot_draw_cards")}
              </button>
              <CardDisplay drawnCards={drawnCards} revealedCards={revealedCards} />
            </>
          )}

          {loading && <LoadingIndicator />}
          <AnalysisResults detailedAnalysis={detailedAnalysis} />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default TarotReader;
