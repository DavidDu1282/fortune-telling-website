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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatHistory messages={messages} loading={loading} t={t} />
      </div>
      <div className="mt-4 shrink-0">
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