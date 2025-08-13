// src/components/Tarot/CardSelector.jsx
import React from "react";
import { useTranslation } from "react-i18next";

import useCardDrawing from "../../hooks/Tarot/useCardDrawing";
import CardDisplay from "./CardDisplay";

export const CardSelector = ({ spread, onDrawComplete }) => {
  const { t } = useTranslation("tarot");
  const { drawCards, drawnCards, revealedCards } = useCardDrawing(spread, onDrawComplete);

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

export default CardSelector;