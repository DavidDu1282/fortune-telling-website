// src/components/Tarot/DeckProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
//import { fetchTarotDeck } from "./api"; // REMOVED: No longer needed
import { useTranslation } from "react-i18next";
import tarotData from "../../assets/text/optimized_tarot_translated.json"; // Direct import


const DeckContext = createContext(null);

export const useDeck = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeck must be used within a DeckProvider");
  }
  return context;
};

export const DeckProvider = ({ children }) => {
  const [tarotDeck, setTarotDeck] = useState([]);
  const [deckError, setDeckError] = useState(null);
  const [deckLoading, setDeckLoading] = useState(true); // Keep loading state (for a very short time)
  const { t } = useTranslation();

  useEffect(() => {
    // No async function needed
    setDeckLoading(true); // Start loading (it'll be very fast)

    try {
      // Validate the structure of the imported JSON
      if (tarotData && tarotData.cards && Array.isArray(tarotData.cards)) {
        setTarotDeck(tarotData.cards);
        setDeckError(null);
      } else {
        console.error("Invalid JSON structure: Missing or invalid 'cards' field");
        setDeckError(t("deck_empty_error"));
      }
    } catch (error) {
      // Catch any errors during parsing (though unlikely with direct import)
      console.error("Error loading tarot deck:", error);
      setDeckError(t("deck_empty_error"));
    } finally {
      setDeckLoading(false); // End loading
    }
  }, [t]); // Dependency array is still good practice

  const value = {
    tarotDeck,
    deckError,
    deckLoading,
  };

  return (
    <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
  );
};