// src/components/Tarot/AnalysisController.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AnalysisResults from "./AnalysisResults";
import LoadingIndicator from "./LoadingIndicator";
import useTarotAnalysis from "../../hooks/Tarot/useTarotAnalysis"; // Import the hook

export const AnalysisController = ({
    sessionId,
    selectedSpread,
    context,
    drawnCards,
    analyzeImmediately = false
}) => {
    const { t } = useTranslation("tarot"); // Use the "tarot" translation namespace
    const { response, detailedAnalysis, loading, error, analyzeDraw } = useTarotAnalysis();

    useEffect(() => {
        analyzeDraw(sessionId, selectedSpread, context, drawnCards, analyzeImmediately);
    }, [sessionId, selectedSpread, context, drawnCards, analyzeImmediately, analyzeDraw]);


    return (
        <>
            {error && <div className="text-red-500">{error}</div>}
            {loading && <LoadingIndicator />}
            <AnalysisResults detailedAnalysis={detailedAnalysis} />
        </>
    );
};

export default AnalysisController;