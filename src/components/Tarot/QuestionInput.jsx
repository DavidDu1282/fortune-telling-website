import React from "react";

const QuestionInput = ({ context, setContext, language }) => (
  <div className="mb-4">
    <label className="block text-lg font-semibold mb-2">
      {language === "zh" ? "输入你的问题:" : "Enter your question:"}
    </label>
    <input
      type="text"
      value={context}
      onChange={(e) => setContext(e.target.value)}
      placeholder={
        language === "zh" ? "例如: 我会在事业上成功吗?" : "e.g., Will I succeed in my career?"
      }
      className="block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
    />
  </div>
);

export default QuestionInput;
