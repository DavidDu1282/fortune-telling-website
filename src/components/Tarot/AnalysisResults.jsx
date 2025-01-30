// import React from "react";
// import ReactMarkdown from "react-markdown";

// const AnalysisResults = ({ response, detailedAnalysis, language }) => (
//   <div className="mt-8 p-6 bg-white text-gray-800 rounded-lg shadow-lg">
//     <h2 className="text-2xl font-bold mb-4">
//       {language === "zh" ? "你的塔罗分析" : "Your Tarot Analysis"}
//     </h2>
//     <ReactMarkdown>{response}</ReactMarkdown>
//     <ReactMarkdown>{detailedAnalysis}</ReactMarkdown>
//   </div>
// );

// export default AnalysisResults;

// Typing effect version

import ReactMarkdown from "react-markdown";

const AnalysisResults = ({ detailedAnalysis, language }) => (
  detailedAnalysis && (
    <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-lg text-gray-300 text-sm leading-relaxed">
      <ReactMarkdown>{detailedAnalysis}</ReactMarkdown>
    </div>
  )
);

export default AnalysisResults;
