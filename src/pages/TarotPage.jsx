// src/pages/TarotPage.jsx
import React, { useState, useCallback } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import QuestionInput from "../components/Tarot/QuestionInput";
import { DeckProvider } from "../components/Tarot/DeckProvider";
import { SpreadController } from "../components/Tarot/SpreadController";
import { CardSelector } from "../components/Tarot/CardSelector";
import { AnalysisController } from "../components/Tarot/AnalysisController";
import ManualCardInput from "../components/Tarot/ManualCardInput";
import { v4 as uuidv4 } from 'uuid';
import DeckStatus from "../components/Tarot/DeckStatus";

const TarotPage = () => {
  const { t } = useTranslation("tarot");
  const [context, setContext] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [sessionId, setSessionId] = useState(uuidv4());
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [analysisTriggered, setAnalysisTriggered] = useState(false); // Add analysisTriggered

  const handleDrawComplete = useCallback((cards) => {
    setDrawnCards(cards);
    setAnalysisTriggered(false); // Reset when new cards are drawn
  }, []);

  const handleManualAnalyze = useCallback((selectedCards) => {
    setDrawnCards(selectedCards);
    setAnalysisTriggered(false);  // Reset when manually analyzing
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{t("title")}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-purple-700 text-gray-100">
        <div className="container mx-auto p-6 relative">

          <SpreadController onSpreadChange={setSelectedSpread} />
          <QuestionInput context={context} setContext={setContext} />

          <div className="mb-4">
            <button
              onClick={() => setManualMode((prev) => !prev)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            >
              {manualMode
                ? t("switch_to_auto")
                : t("switch_to_manual")}
            </button>
          </div>

          <DeckProvider>
            <DeckStatus>
              {manualMode ? (
                <ManualCardInput
                  spread={selectedSpread?.count}
                  onManualAnalyze={handleManualAnalyze}
                />
              ) : (
                selectedSpread && (
                  <CardSelector
                    spread={selectedSpread}
                    onDrawComplete={handleDrawComplete}
                  />
                )
              )}
              {/* Pass analysisTriggered and setAnalysisTriggered to AnalysisController */}
              <AnalysisController
                sessionId={sessionId}
                selectedSpread={selectedSpread}
                context={context}
                drawnCards={drawnCards}
                analysisTriggered={analysisTriggered} // Pass as prop
                setAnalysisTriggered={setAnalysisTriggered} // Pass as prop
              />
            </DeckStatus>
          </DeckProvider>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default TarotPage;