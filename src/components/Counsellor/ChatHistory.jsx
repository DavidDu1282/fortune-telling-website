// components/Counsellor/ChatHistory.jsx
import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatHistory = ({ messages, loading, t }) => {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container p-3 rounded-md bg-gray-700 flex flex-col space-y-2 overflow-y-auto min-h-0 max-h-full">
      {messages.map((msg, index) => (
        <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-700 self-end" : "bg-gray-800"}`}>
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      ))}

      {loading && <p className="text-gray-500">{t("thinking")}</p>}

      {/* 🔽 Anchor for auto-scroll */}
      <div ref={endRef} />
    </div>
  );
};

export default ChatHistory;
// // components/Counsellor/ChatHistory.jsx
// import React from 'react';
// import ReactMarkdown from 'react-markdown';

// const ChatHistory = ({ messages, loading, t }) => {
//   return (
//     <div className="chat-container flex-1 flex flex-col p-3 rounded-md bg-gray-700">
//       {messages.map((msg, index) => (
//         <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-700 self-end" : "bg-gray-800"}`}>
//           <ReactMarkdown>{msg.text}</ReactMarkdown>
//         </div>
//       ))}
//       {loading && <p className="text-gray-500">{t("thinking")}</p>}
//     </div>
//   );
// };

// export default ChatHistory;
