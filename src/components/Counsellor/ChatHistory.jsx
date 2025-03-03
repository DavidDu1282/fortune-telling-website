// components/Counsellor/ChatHistory.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatHistory = ({ messages, loading, t }) => {
  return (
    <div className="chat-container overflow-auto max-h-[400px] border p-3 rounded-md bg-gray-100">
      {messages.map((msg, index) => (
        <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-200 self-end" : "bg-gray-300"}`}>
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      ))}
      {loading && <p className="text-gray-500">{t("thinking")}</p>}
    </div>
  );
};

export default ChatHistory;
