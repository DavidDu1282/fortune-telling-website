// src/components/Tarot/QuestionInput.jsx
import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const QuestionInput = ({ context, setContext }) => { // Remove language prop
  const { t } = useTranslation("tarot"); // Use the hook

  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2">
        {t("questionLabel")}
      </label>
      <input
        type="text"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder={t("questionPlaceholder")}
        className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
      />
    </div>
  );
};

export default QuestionInput;