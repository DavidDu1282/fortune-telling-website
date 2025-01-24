import React from "react";
import { spreads } from "./Spreads";

const SpreadSelector = ({ spread, setSpread, language }) => (
  <div className="mb-4">
    <label className="block text-lg font-semibold mb-2">
      {language === "zh" ? "选择一个牌阵:" : "Choose a spread:"}
    </label>
    <select
      value={spread}
      onChange={(e) => setSpread(e.target.value)}
      className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
    >
      {Object.entries(spreads).map(([key, value]) => (
        <option key={key} value={key}>
          {value.label[language]}
        </option>
      ))}
    </select>
  </div>
);

export default SpreadSelector;
