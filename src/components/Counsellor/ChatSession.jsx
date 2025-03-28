// src/components/Counsellor/ChatSession.jsx
import React from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";

const ChatSession = ({
  messages,
  loading,
  sendMessage,
  input,
  setInput,
  t,
  isListening,
  toggleListen,
  hasSpeechRecognition,
  speechRecognitionError,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-700 flex-grow overflow-y-auto">
        <ChatHistory messages={messages} loading={loading} t={t} />
      </div>
      <div className="mt-4">
        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          t={t}
          isListening={isListening}
          toggleListen={toggleListen}
          hasSpeechRecognition={hasSpeechRecognition}
          speechRecognitionError={speechRecognitionError}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ChatSession;