// src/components/Tarot/AnalysisController.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AnalysisResults from "./AnalysisResults";
import LoadingIndicator from "../LoadingIndicator";
import useTarotAnalysis from "../../hooks/Tarot/useTarotAnalysis";

export const AnalysisController = ({
    sessionId,
    selectedSpread,
    context,
    drawnCards,
    analysisTriggered,
    setAnalysisTriggered,
}) => {
    const { t } = useTranslation("tarot");
    const { response, detailedAnalysis, loading, error, fetchAnalysis } = useTarotAnalysis();

    useEffect(() => {
        if (drawnCards.length > 0 && selectedSpread && !analysisTriggered) {
            fetchAnalysis(sessionId, selectedSpread, context, drawnCards);
            setAnalysisTriggered(true);
        }
    }, [drawnCards, selectedSpread, sessionId, context, fetchAnalysis, analysisTriggered, setAnalysisTriggered]);

    return (
        <>
            {error && <div className="text-red-500">{error}</div>}
            {loading && <LoadingIndicator />}
            <AnalysisResults detailedAnalysis={detailedAnalysis} />
        </>
    );
};

export default AnalysisController;