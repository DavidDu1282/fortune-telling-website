// DeckStatus.jsx
import React from 'react';
import { useDeck } from './DeckProvider';

const DeckStatus = ({ children }) => {
  const { deckLoading, deckError } = useDeck();

  if (deckLoading) {
    return <div>Loading Tarot Deck...</div>;
  }

  if (deckError) {
    return <div>Error: {deckError}</div>;
  }

  return <>{children}</>;
};

export default DeckStatus;