// src/hooks/Tarot/useCardDrawing.js
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useDeck } from "../../components/Tarot/DeckProvider";

const CARD_REVEAL_DELAY = 500;

const useCardDrawing = (spread, onDrawComplete) => {
  const { tarotDeck } = useDeck();
  const [drawnCards, setDrawnCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const { t } = useTranslation("tarot");
  const lastDraw = useRef(null);

  const drawCards = useCallback(async () => {
    if (!tarotDeck.length) {
      alert(t("deck_empty_error"));
      return;
    }

    if (lastDraw.current) {
      if (onDrawComplete) {
        onDrawComplete(lastDraw.current.selectedCards);
      }
      setDrawnCards(lastDraw.current.selectedCards);
      setRevealedCards(lastDraw.current.revealedCards);
      return;
    }

    const count = spread.count;
    const shuffledDeck = [...tarotDeck].sort(() => Math.random() - 0.5);
    const selectedCards = shuffledDeck.slice(0, count).map((card) => ({
      ...card,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
    }));

    setDrawnCards(selectedCards);
    setRevealedCards([]);

    for (let i = 0; i < selectedCards.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, CARD_REVEAL_DELAY));
      setRevealedCards((prev) => [...prev, i]);
    }

    lastDraw.current = {
      selectedCards,
      revealedCards: Array.from({ length: selectedCards.length }, (_, i) => i),
    };

    if (onDrawComplete) {
      onDrawComplete(selectedCards);
    }
  }, [tarotDeck, spread, t, onDrawComplete]);

  useEffect(() => {
    setDrawnCards([]);
    setRevealedCards([]);
    lastDraw.current = null;
  }, [spread]);

  useEffect(() => {
    if (drawnCards.length > 0 && onDrawComplete) {
      onDrawComplete(drawnCards);
    }
  }, [drawnCards, onDrawComplete]);

  return { drawCards, drawnCards, revealedCards };
};

export default useCardDrawing;