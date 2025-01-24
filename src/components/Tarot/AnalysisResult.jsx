import React from "react";
import ReactMarkdown from "react-markdown";

const AnalysisResult = ({ response, detailedAnalysis, language }) => (
  <div className="mt-8 p-6 bg-white text-gray-800 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-4">
      {language === "zh" ? "你的塔罗分析" : "Your Tarot Analysis"}
    </h2>
    <ReactMarkdown>{response}</ReactMarkdown>
    <ReactMarkdown>{detailedAnalysis}</ReactMarkdown>
  </div>
);

export default AnalysisResult;
