// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const availableLanguages = [
    { code: "en", label: "English" },
    { code: "zh", label: "简体中文" },
    { code: "zh_TW", label: "繁体中文" }
  ];

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
    >
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
