// // src/hooks/tarot/useTarotAnalysis.js
// import { useState, useCallback } from "react";
// import { useTranslation } from "react-i18next";

// const useTarotAnalysis = () => {
//     const { i18n, t } = useTranslation("tarot"); // Use the "tarot" namespace
//     const [response, setResponse] = useState("");
//     const [detailedAnalysis, setDetailedAnalysis] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const analyzeDraw = useCallback(async (sessionId, selectedSpread, context, drawnCards, analyzeImmediately) => {
//       if (!analyzeImmediately || drawnCards.length === 0) {
//         return; // Don't analyze if not requested or no cards
//       }
//         setLoading(true);
//         setError(null); // Clear previous errors
//         try {
//              // Determine the spread label, defaulting to "en"
//             const spreadLabel = selectedSpread.label[i18n.language] || selectedSpread.label["en"];

//             const requestBody = {
//                 session_id: sessionId,
//                 spread: spreadLabel,  // Use the determined spread label
//                 tarot_cards: drawnCards.map((card) => ({
//                   name: card.name,
//                   orientation: card.orientation
//                 })),
//                 user_context: context,
//                 language: i18n.language,
//             };

//             const response = await fetch(
//                 `${import.meta.env.VITE_API_URL || ""}/api/tarot/analyze`,
//                 {
//                     method: "POST",
//                     credentials: "include",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(requestBody),
//                 }
//             );

//             if (!response.ok) {
//                 const errorData = await response.json();
//                  let errorMessage = t("error_analyzing"); // Use a translation key
//                 if (response.status === 401) {
//                     errorMessage = t("not_logged_in"); // Reuse common translation
//                 }
//                  throw new Error(`${response.status} - ${errorData.message || 'Unknown error'}`);
//             }

//             const result = await response.json();
//             setResponse(result.message);
//             setDetailedAnalysis(result.summary);

//         } catch (error) {
//              console.error("Error analyzing tarot draw:", error);
//              setError(error.message);

//         } finally {
//             setLoading(false);
//         }
//     }, [i18n, t]); // Add i18n and t to the dependency array


//     return { response, detailedAnalysis, loading, error, analyzeDraw };
// };

// export default useTarotAnalysis;

// src/hooks/Tarot/useTarotAnalysis.js
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { analyzeDraw } from "../../api/tarotApi"; // Import the API function

const useTarotAnalysis = () => {
    const { i18n, t } = useTranslation("tarot");
    const [response, setResponse] = useState("");
    const [detailedAnalysis, setDetailedAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Renamed to fetchAnalysis, takes only necessary arguments
    const fetchAnalysis = useCallback(async (sessionId, selectedSpread, context, drawnCards) => {
        setLoading(true);
        setError(null);

        try {
            const spreadLabel = selectedSpread?.label?.[i18n.language] || selectedSpread?.label?.["en"] || ""; // Handle null/undefined spread

            // Call the API function directly.  No need to duplicate the request building.
            const result = await analyzeDraw(drawnCards, spreadLabel, context, sessionId, i18n.language);

            setResponse(result.message);
            setDetailedAnalysis(result.summary);

        } catch (error) {
            console.error("Error analyzing tarot draw:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [i18n, t]); // Dependencies

    return { response, detailedAnalysis, loading, error, fetchAnalysis }; // Return fetchAnalysis
};

export default useTarotAnalysis;
