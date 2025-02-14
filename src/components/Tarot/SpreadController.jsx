// src/components/Tarot/SpreadController.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import SpreadSelector from "./SpreadSelector"; // The original selector
import { spreads } from "./Spreads";

export const SpreadController = ({ onSpreadChange, initialSpread = "three_card" }) => {
  const { i18n } = useTranslation();
  const [spreadKey, setSpreadKey] = useState(initialSpread);

  const selectedSpread = useMemo(() => spreads[spreadKey], [spreadKey]);
    const localizedSpreadLabel = useMemo(() => {
        return selectedSpread.label[i18n.language];
    }, [selectedSpread, i18n.language])

    React.useEffect(() => {
      if(onSpreadChange){
        onSpreadChange(selectedSpread)
      }
    }, [selectedSpread, onSpreadChange])

  return (
    <SpreadSelector
      spread={localizedSpreadLabel}
      setSpread={setSpreadKey}
    />
  );
};