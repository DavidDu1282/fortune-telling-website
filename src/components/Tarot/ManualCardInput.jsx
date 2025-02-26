// src/components/Tarot/ManualCardInput.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDeck } from "./DeckProvider";

const ManualCardInput = ({
  spread, // This is the *number* of cards
  onManualAnalyze,
}) => {
  const { t } = useTranslation("tarot");
  const { tarotDeck } = useDeck();

  const [selectedCards, setSelectedCards] = useState(Array(spread).fill(null));

  const cardOptions = useMemo(() => {
    return tarotDeck.map((card) => ({
      value: card.name,
      label: card.name,
      cardData: card,
    }));
    }, [tarotDeck]);

  const orientationOptions = [
    { value: "upright", label: t("upright") },
    { value: "reversed", label: t("reversed") },
  ];

    useEffect(() => {
        setSelectedCards(Array(spread).fill(null))
    }, [spread])


  const handleCardChange = (index, cardName) => {
    const newSelectedCards = [...selectedCards];
    const selectedCard = tarotDeck.find(card => card.name === cardName);

    if(selectedCard){
        newSelectedCards[index] = {
          name: selectedCard.name,
          orientation: "upright", // Default orientation
        }
        setSelectedCards(newSelectedCards);
    } else {
        //If no card is selected.
        newSelectedCards[index] = null
        setSelectedCards(newSelectedCards)
    }

  };

  const handleOrientationChange = (index, orientation) => {
     const newSelectedCards = [...selectedCards];
    if(!newSelectedCards[index]) return;

    newSelectedCards[index] = {
      ...newSelectedCards[index],
      orientation: orientation,
    };
    setSelectedCards(newSelectedCards);
  };

  const handleAnalyzeClick = () => {
    const cardsToAnalyze = selectedCards.filter(card=> card !== null).map((card) => ({
        name: card.name,
        orientation: card.orientation
    }))

    if (cardsToAnalyze.length === spread) {
      onManualAnalyze(cardsToAnalyze);
    } else {
      alert(t("select_all_cards"));
    }
  };
    const isAnalyzeDisabled = React.useMemo(() => {
        return selectedCards.filter(card=> card !== null).length !== spread
    }, [selectedCards, spread])

  return (
     <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedCards.map((_, index) => (
          <div key={index} className="mb-4">
            <label
              htmlFor={`card-select-${index}`}
              className="block text-sm font-medium text-gray-300"
            >
              {t("card")} {index + 1}:
            </label>
            <select
              id={`card-select-${index}`}
              value={selectedCards[index] ? selectedCards[index].name : ""}
              onChange={(e) => handleCardChange(index, e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">{t("select_card")}</option>
              {cardOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label
              htmlFor={`orientation-select-${index}`}
              className="block mt-2 text-sm font-medium text-gray-300"
            >
              {t("orientation")}:
            </label>
            <select
              id={`orientation-select-${index}`}
              value={selectedCards[index]?.orientation || "upright"}
              onChange={(e) => handleOrientationChange(index, e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {orientationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={handleAnalyzeClick}
        className={`px-6 py-3 mt-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 ${
          isAnalyzeDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isAnalyzeDisabled}
      >
        {t("analyze")}
      </button>
    </div>
  );
};

export default ManualCardInput;