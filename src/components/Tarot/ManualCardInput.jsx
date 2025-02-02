import React from "react";
import { useTranslation } from "react-i18next"; 

const ManualCardInput = ({ tarotDeck, spread, manualCards, setManualCards, analyzeDraw}) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const handleManualCardChange = (index, field, value) => {
    const updatedCards = [...manualCards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setManualCards(updatedCards);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: spread }).map((_, index) => (
          <div key={index} className="mb-4">
            {/* Card Selection */}
            <select
              onChange={(e) => handleManualCardChange(index, "name", e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            >
              <option value="">{t("tarot_select_card")}</option>
              {tarotDeck.map((card) => (
                <option key={card.name} value={card.name}>
                  {i18n.language === "zh" ? card.nameZh : card.name}
                </option>
              ))}
            </select>

            {/* Card Orientation Selection */}
            <select
              onChange={(e) => handleManualCardChange(index, "orientation", e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            >
              <option value="upright">{t("tarot_upright")}</option>
              <option value="reversed">{t("tarot_reversed")}</option>
            </select>
          </div>
        ))}
      </div>

      <button onClick={() => analyzeDraw(manualCards)} className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-md">
        {t("tarot_analyze_draw")}
      </button>
    </>
  );
};

export default ManualCardInput;
