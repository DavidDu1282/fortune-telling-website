import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

const CounsellorPage = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "";

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/counsellor/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "unique-session-id",
          message: input,
          language: i18n.language,
        }),
      });
      
      const result = await response.json();
      setMessages([...newMessages, { text: result.response, sender: "ai" }]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-blue-700 text-gray-100 p-6">
      <div className="container mx-auto max-w-2xl bg-white shadow-lg rounded-lg p-6 text-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t("counsellor_title")}</h1>
        </div>

        <div className="chat-container overflow-auto max-h-[400px] border p-3 rounded-md bg-gray-100">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-200 self-end" : "bg-gray-300"}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <p className="text-gray-500">{t("counsellor_thinking")}</p>}
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-md bg-gray-200 text-gray-900"
            placeholder={t("counsellor_input_placeholder")}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t("counsellor_send")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CounsellorPage;
