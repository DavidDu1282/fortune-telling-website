// src/components/Tarot/CardDrawer.jsx
import React, { useState, useCallback, useEffect } from "react";
import CardDisplay from "./CardDisplay";
import { useTranslation } from "react-i18next";
import { useDeck } from "./DeckProvider";

const CARD_REVEAL_DELAY = 500;

export const CardDrawer = ({ spread, onDrawComplete }) => {
  const { tarotDeck } = useDeck();
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const { t } = useTranslation();

  const drawCards = useCallback(async () => {
      if (!tarotDeck.length) {
          alert(t("tarot_deck_empty_error"));
          return;
      }

      const count = spread.count;
      const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
      const selectedCards = shuffledDeck.slice(0, count).map((card) => ({
          ...card,
          orientation: Math.random() > 0.5 ? "upright" : "reversed",
      }));

      setDrawnCards(selectedCards);
      setRevealedCards([]); // Clear previous reveals

      for (let i = 0; i < selectedCards.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, CARD_REVEAL_DELAY));
        setRevealedCards((prev) => [...prev, i]);
      }
      if(onDrawComplete) {
        onDrawComplete(selectedCards);
      }

  }, [tarotDeck, spread, t, onDrawComplete]);

    useEffect(() => {
      setDrawnCards([]);
      setRevealedCards([]);
    }, [spread]);

  return (
    <>
      <button
        onClick={drawCards}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        {t("tarot_draw_cards")}
      </button>
      <CardDisplay drawnCards={drawnCards} revealedCards={revealedCards} />
    </>
  );
};