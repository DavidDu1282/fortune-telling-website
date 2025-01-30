import React from "react";

const ManualCardInput = ({ tarotDeck, spread, manualCards, setManualCards, analyzeDraw, language }) => {
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
            <select onChange={(e) => handleManualCardChange(index, "name", e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800">
              <option value="">{language === "zh" ? "选择卡牌" : "Select Card"}</option>
              {tarotDeck.map((card) => (
                <option key={card.name} value={card.name}>
                  {language === "zh" ? card.nameZh : card.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button onClick={() => analyzeDraw(manualCards)} className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-md">
        {language === "zh" ? "分析牌阵" : "Analyze Spread"}
      </button>
    </>
  );
};

export default ManualCardInput;
