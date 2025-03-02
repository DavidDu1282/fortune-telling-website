// src/components/Tarot/CardDrawer.jsx
import React, { useState, useCallback, useEffect, useRef } from "react"; // Import useRef
import CardDisplay from "./CardDisplay";
import { useTranslation } from "react-i18next";
import { useDeck } from "./DeckProvider";

const CARD_REVEAL_DELAY = 500;

export const CardDrawer = ({ spread, onDrawComplete }) => {
  const { tarotDeck } = useDeck();
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const { t, i18n } = useTranslation("tarot"); // Destructure i18n
    const lastDraw = useRef(null);


  const drawCards = useCallback(async () => {
      if (!tarotDeck.length) {
          alert(t("deck_empty_error"));
          return;
      }

        // Use the last successful draw if we have one
        if (lastDraw.current) {
            if (onDrawComplete) {
                onDrawComplete(lastDraw.current.selectedCards);
            }
            setDrawnCards(lastDraw.current.selectedCards);
            setRevealedCards(lastDraw.current.revealedCards);
            return;  // Exit the function early, avoiding a re-draw
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

      // Store this draw
        lastDraw.current = { selectedCards, revealedCards: Array.from({ length: selectedCards.length }, (_, i) => i) };

      if(onDrawComplete) {
        onDrawComplete(selectedCards);
      }

  }, [tarotDeck, spread, t, onDrawComplete]); // Removed i18n from dependencies

    useEffect(() => {
      setDrawnCards([]);
      setRevealedCards([]);
      lastDraw.current = null; // Reset on spread change
    }, [spread]);

      // Add this useEffect hook
    useEffect(() => {
        if (drawnCards.length > 0 && onDrawComplete)
        {
            onDrawComplete(drawnCards)
        }
    }, [drawnCards, onDrawComplete])

  return (
    <>
      <button
        onClick={drawCards}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        {t("draw_cards")}
      </button>
      <CardDisplay drawnCards={drawnCards} revealedCards={revealedCards} />
    </>
  );
};