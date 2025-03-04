import React from "react";

const Header = ({ language, setLanguage }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
      {language === "zh" ? "塔罗牌阅读器" : "Tarot Reader"}
    </h1>
    <button
      onClick={() => setLanguage((prevLanguage) => (prevLanguage === "zh" ? "en" : "zh"))}
      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
    >
      {language === "zh" ? "切换为英语" : "Switch to Chinese"}
    </button>
  </div>
);

export default Header;
