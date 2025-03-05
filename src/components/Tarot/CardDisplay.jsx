// src/components/Tarot/CardDisplay.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const BASE_URL = import.meta.env.VITE_BASE_URL || "/";

const CardDisplay = ({ drawnCards, revealedCards, language }) => {
  const { i18n } = useTranslation(); // Get the current language

  return (
    <div className="flex flex-wrap justify-center gap-6 my-8">
      {drawnCards.map((card, index) => (
        <div
          key={index}
          className={`relative w-[calc(100vw/2.5)] max-w-[200px] sm:w-[calc(100vw/4)] sm:max-w-[250px] md:w-[calc(100vw/6)] md:max-w-[300px] lg:w-[calc(100vw/8)] lg:max-w-[350px] h-[calc((100vw/2.5)*600/350)] max-h-[600px] sm:h-[calc((100vw/4)*600/350)] sm:max-h-[600px] md:h-[calc((100vw/6)*600/350)] md:max-h-[600px] lg:h-[calc((100vw/8)*600/350)] lg:max-h-[600px] cursor-pointer perspective-1000 ${
            revealedCards.includes(index) ? "animate-sparkle-big" : "animate-sparkle-small"
          }`}
        >
          <div
            className={`w-full h-full transition-transform duration-700 ease-in-out transform ${
              revealedCards.includes(index) ? "rotate-y-180" : "rotate-y-0"
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Card Back */}
            <div
              className="absolute w-full h-full bg-indigo-800 text-gray-200 flex items-center justify-center rounded-lg shadow-lg border-2 border-indigo-900"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-2xl font-bold">?</p>
            </div>
            {/* Card Front */}
            <div
              className="absolute w-full h-full bg-yellow-300 text-black flex flex-col items-center justify-between rounded-lg shadow-xl border-2 border-yellow-500"
              style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
            >
              <div className="w-full h-[70%] relative"> {/* Container for image */}
                <img
                  src={`${BASE_URL}tarot/cards/${card.img}`}
                  alt={card.name}
                  className={`absolute inset-0 w-full h-full object-contain rounded-t-lg ${revealedCards.includes(index) && card.orientation === "reversed" ? "rotate-180" : ""}`}
                  loading="lazy"
                />
              </div>
              <p className="h-auto py-2 px-1 flex items-center justify-center text-lg font-semibold text-center">
                {i18n.language === "zh" ? card.nameZh : card.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardDisplay;