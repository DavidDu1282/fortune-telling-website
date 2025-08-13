// src/components/Tarot/SpreadController.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { spreads } from "./Spreads";

export const SpreadController = ({ onSpreadChange, initialSpread = "three_card" }) => {
  const { i18n } = useTranslation();
  const [spreadKey, setSpreadKey] = useState(initialSpread);

    const selectedSpread = useMemo(() => spreads[spreadKey], [spreadKey]);
    const localizedSpreadLabel = useMemo(() => {
        return selectedSpread?.label[i18n.language] || selectedSpread?.label["en"];
    }, [selectedSpread, i18n.language])

    useEffect(() => {
        if (onSpreadChange) {
            onSpreadChange(selectedSpread);
        }
    }, [selectedSpread, onSpreadChange]);

  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">
        {localizedSpreadLabel}
      </label>
      <select
        value={spreadKey}
        onChange={(e) => setSpreadKey(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
      >
        {Object.entries(spreads).map(([key, value]) => (
          <option key={key} value={key}>
            {value.label[i18n.language] || value.label["en"]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SpreadController;