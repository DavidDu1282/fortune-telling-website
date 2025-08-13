// src/components/Tarot/DeckProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";

import tarotData from "../../assets/text/simplified_tarot.json"; // Direct import

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
  const [deckLoading, setDeckLoading] = useState(true); 
  const { t } = useTranslation();

  useEffect(() => {
    setDeckLoading(true);

    try {
      if (tarotData  && Array.isArray(tarotData)) {
        setTarotDeck(tarotData);
        setDeckError(null);
      } else {
        console.error("Invalid JSON structure: Missing or invalid 'cards' field");
        setDeckError(t("deck_empty_error"));
      }
    } catch (error) {
      console.error("Error loading tarot deck:", error);
      setDeckError(t("deck_empty_error"));
    } finally {
      setDeckLoading(false);
    }
  }, [t]);

  const value = {
    tarotDeck,
    deckError,
    deckLoading,
  };

  return (
    <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
  );
};

export default DeckProvider;