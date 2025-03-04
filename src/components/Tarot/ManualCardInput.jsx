// src/components/Tarot/ManualCardInput.jsx
import React from "react";
import useManualCardSelection from "../../hooks/Tarot/useManualCardSelection"; //Correct relative path

const ManualCardInput = ({ spread, onManualAnalyze }) => {
  const {
    t,
    selectedCards,
    cardOptions,
    orientationOptions,
    handleCardChange,
    handleOrientationChange,
    handleAnalyzeClick,
    isAnalyzeDisabled,
  } = useManualCardSelection(spread, onManualAnalyze);

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