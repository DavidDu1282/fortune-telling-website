// src/hooks/Tarot/useTarotAnalysis.js
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { analyzeDraw } from "../../api/tarotApi";

const useTarotAnalysis = () => {
    const { i18n } = useTranslation("tarot");
    const [response, setResponse] = useState(""); // Keep this if you need a "message"
    const [detailedAnalysis, setDetailedAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAnalysis = useCallback(async (sessionId, selectedSpread, context, drawnCards) => {
        setLoading(true);
        setError(null);
        setDetailedAnalysis(""); // Clear previous analysis on new request
        setResponse(""); // Clear if you use setResponse.

        try {
            const spreadLabel = selectedSpread?.label?.["en"] //selectedSpread?.label?.[i18n.language] || selectedSpread?.label?.["en"] || "";

            await analyzeDraw(drawnCards, spreadLabel, context, sessionId, i18n.language, (chunk) => {
                if (chunk.startsWith("Error:")) {
                    setError(chunk); // Set error directly
                } else {
                  setDetailedAnalysis((prevAnalysis) => prevAnalysis + chunk);
                }
            });

        } catch (error) {
            console.error("Error analyzing tarot draw:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [i18n]);
    return { response, detailedAnalysis, loading, error, fetchAnalysis };
};

export default useTarotAnalysis;
