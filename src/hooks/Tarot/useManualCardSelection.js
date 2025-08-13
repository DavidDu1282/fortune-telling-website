// src/hooks/useManualCardSelection.js
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDeck } from "../../components/Tarot/DeckProvider";

const useManualCardSelection = (spread, onManualAnalyze) => {
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
    setSelectedCards(Array(spread).fill(null));
  }, [spread]);

  const handleCardChange = (index, cardName) => {
    const newSelectedCards = [...selectedCards];
    const selectedCard = tarotDeck.find((card) => card.name === cardName);

    if (selectedCard) {
      newSelectedCards[index] = {
        name: selectedCard.name,
        orientation: "upright",
      };
    } else {
      newSelectedCards[index] = null;
    }
    setSelectedCards(newSelectedCards);
  };

  const handleOrientationChange = (index, orientation) => {
    const newSelectedCards = [...selectedCards];
    if (!newSelectedCards[index]) return;

    newSelectedCards[index] = {
      ...newSelectedCards[index],
      orientation: orientation,
    };
    setSelectedCards(newSelectedCards);
  };

  const handleAnalyzeClick = () => {
    const cardsToAnalyze = selectedCards
      .filter((card) => card !== null)
      .map((card) => ({
        name: card.name,
        orientation: card.orientation,
      }));

    if (cardsToAnalyze.length === spread) {
      onManualAnalyze(cardsToAnalyze);
    } else {
      alert(t("select_all_cards"));
    }
  };

  const isAnalyzeDisabled = useMemo(() => {
    return selectedCards.filter((card) => card !== null).length !== spread;
  }, [selectedCards, spread]);

  return {
    t,
    selectedCards,
    cardOptions,
    orientationOptions,
    handleCardChange,
    handleOrientationChange,
    handleAnalyzeClick,
    isAnalyzeDisabled,
  };
};

export default useManualCardSelection;
