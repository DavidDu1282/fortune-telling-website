import React from "react";

const CardDisplay = ({ drawnCards, revealedCards, language }) => (
  <div className="flex flex-wrap justify-center gap-6 my-8">
    {drawnCards.map((card, index) => (
      <div
        key={index}
        className={`relative w-40 h-60 cursor-pointer perspective-1000 ${
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
            className="absolute w-full h-full bg-yellow-300 text-black flex flex-col items-center justify-center rounded-lg shadow-xl border-2 border-yellow-500"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <img
              src={`/tarot/cards/${card.img}`}
              alt={card.name}
              className={`w-full h-40 object-cover rounded-t-lg ${
                revealedCards.includes(index) && card.orientation === "reversed" ? "rotate-180" : ""
              }`}
              loading="lazy"
            />
            <p className="mt-2 text-lg font-semibold">{card.name}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CardDisplay;
