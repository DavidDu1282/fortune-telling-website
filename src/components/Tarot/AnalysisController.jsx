// src/components/Tarot/AnalysisController.jsx
import React, { useState, useCallback, useEffect, useRef } from "react"; // import useRef
import { useTranslation } from "react-i18next";
import AnalysisResults from "./AnalysisResults";
import LoadingIndicator from "./LoadingIndicator";

export const AnalysisController = ({
    sessionId,
    selectedSpread,
    context,
    drawnCards,
    analyzeImmediately = false
}) => {
    const { i18n, t } = useTranslation();
    const [response, setResponse] = useState("");
    const [detailedAnalysis, setDetailedAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState(null);

    // useRef to persist the language
    const currentLanguage = useRef(i18n.language);

    useEffect(() => {
        currentLanguage.current = i18n.language;
    }, [i18n.language]);

    const analyzeDraw = useCallback(async (cardsToAnalyze) => {
        setLoading(true);
        setAnalysisError(null); // Reset error state
        try {
            // Determine the spread label, defaulting to "en"
            const spreadLabel = selectedSpread.label[currentLanguage.current] || selectedSpread.label["en"];

            const requestBody = {
                session_id: sessionId,
                spread: spreadLabel,  // Use the determined spread label
                tarot_cards: cardsToAnalyze,
                user_context: context,
                language: currentLanguage.current, // Still send the original language code to the backend
            };
            console.log("Sending API Request:", requestBody);
            const token = localStorage.getItem('accessToken');

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || ""}/api/tarot/analyze`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const result = await response.json();
            setResponse(result.message);
            setDetailedAnalysis(result.summary);
        } catch (error) {
            console.error("Error analyzing tarot draw:", error);
            setAnalysisError(error.message);
        } finally {
            setLoading(false);
        }
    }, [sessionId, selectedSpread, context]); // i18n.language removed from dependencies

    useEffect(() => {
        if (analyzeImmediately && drawnCards.length > 0) {
            analyzeDraw(drawnCards.map((card) => ({
                name: card.name,
                orientation: card.orientation
            })))
        }
    }, [analyzeImmediately, drawnCards, analyzeDraw])

    return (
        <>
            {analysisError && <div className="text-red-500">{analysisError}</div>}
            {loading && <LoadingIndicator />}
            <AnalysisResults detailedAnalysis={detailedAnalysis} />
        </>
    );
};