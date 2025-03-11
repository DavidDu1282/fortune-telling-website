// d:\OtherCodingProjects\fortune-telling-website\src\pages\CounsellorPage.jsx
import React, { useState, useEffect } from "react";
import ChatHistory from "../components/Counsellor/ChatHistory";
import ChatInput from "../components/Counsellor/ChatInput";
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "react-i18next";
import useChat from "../hooks/Counsellor/useChat";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

const CounselorPage = () => {
  const { i18n, t } = useTranslation("counsellor");
  const API_URL = import.meta.env.VITE_API_URL || "";
  const [sessionId, setSessionId] = useState(uuidv4());
  const [input, setInput] = React.useState("");

  const {
    isListening,
    transcript,
    hasSpeechRecognition,
    speechRecognitionError,
    toggleListen,
  } = useSpeechRecognition(i18n.language);

  const { messages, loading, sendMessage,  } = useChat(API_URL, sessionId, setInput);

  useEffect(() => {
    setInput(transcript)
  }, [transcript])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-blue-700 text-gray-100 p-6">
      <div className="container mx-auto max-w-2xl bg-white shadow-lg rounded-lg p-6 text-gray-900 flex flex-col h-full"> {/* Added flex flex-col h-full */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        </div>
        <div className="h-[60vh] overflow-y-auto">
          <ChatHistory messages={messages} loading={loading} t={t} />
        </div>
        <div className="mt-4">
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={() => sendMessage(input)}
            t={t}
            isListening={isListening}
            toggleListen={toggleListen}
            hasSpeechRecognition={hasSpeechRecognition}
            speechRecognitionError={speechRecognitionError}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CounselorPage;
