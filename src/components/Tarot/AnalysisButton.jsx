import React from "react";
import { analyzeDraw } from "./api";

const AnalysisButton = ({
  drawnCards,
  revealedCards,
  spread,
  context,
  language,
  setResponse,
  setDetailedAnalysis,
  setLoading,
}) => {
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeDraw(drawnCards, revealedCards, spread, context, language);
      setResponse(result.message);
      setDetailedAnalysis(result.summary);
    } catch (error) {
      console.error("Error analyzing draw:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAnalyze}
      className="px-6 py-3 bg-green-500 text-white font-bold rounded-md"
    >
      {t("tarot_analyze_draw")}
    </button>
  );
};

export default AnalysisButton;