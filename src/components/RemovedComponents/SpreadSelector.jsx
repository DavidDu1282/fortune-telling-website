import React from "react";
import { useTranslation } from "react-i18next";
import { spreads } from "../Spreads"; // Ensure spreads.js contains translated labels

const SpreadSelector = ({ spread, setSpread }) => {
  const { i18n } = useTranslation(); // Get current language

  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">
        {spreads[spread]?.label[i18n.language] || spreads[spread]?.label["en"]}
      </label>
      <select
        value={spread}
        onChange={(e) => setSpread(e.target.value)}
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

export default SpreadSelector;
