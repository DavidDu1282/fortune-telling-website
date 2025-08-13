// src\components\Counsellor\ChatInput.jsx
import React, { useState, useRef, useEffect } from "react";
import SpeechRecognitionButton from "../SpeechRecognitionButton";

const ChatInput = ({ input, setInput, sendMessage, t, isListening, toggleListen, hasSpeechRecognition, speechRecognitionError, loading }) => {
  const textareaRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-end space-x-2 w-full">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-grow p-2 border rounded-md bg-gray-200 text-gray-900 resize-none overflow-hidden"
        placeholder={t("input_placeholder")}
        rows="1"
        disabled={!hasSpeechRecognition && !input}
      />
      <div className="flex items-stretch space-x-2 flex-shrink-0">
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap min-w-fit h-full"
          disabled={!input}
        >
          {t("send")}
        </button>
        <SpeechRecognitionButton
          hasSpeechRecognition={hasSpeechRecognition}
          toggleListen={toggleListen}
          isListening={isListening}
          loading={loading}
          t={t}
          speechRecognitionError={speechRecognitionError}
        />
      </div>
    </div>
  );
};

export default ChatInput;