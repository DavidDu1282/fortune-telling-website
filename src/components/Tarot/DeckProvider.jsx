// src/components/Tarot/DeckProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchTarotDeck } from "./api";
import { useTranslation } from "react-i18next";

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
  const [deckLoading, setDeckLoading] = useState(true); // Add loading state
  const { t } = useTranslation();

  useEffect(() => {
    const loadDeck = async () => {
      setDeckLoading(true); // Start loading
      try {
        const deck = await fetchTarotDeck();
        setTarotDeck(deck);
        setDeckError(null);
      } catch (error) {
        console.error("Error loading tarot deck:", error);
        setDeckError(t("tarot_deck_empty_error")); // Use translated error
      } finally {
        setDeckLoading(false); // End loading regardless of success/failure
      }
    };

    loadDeck();
  }, [t]);

  const value = {
    tarotDeck,
    deckError,
    deckLoading, // Expose loading state
  };

  return (
    <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
  );
};