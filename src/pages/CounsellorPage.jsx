// CounselorPage.jsx (Refactored)
import React from "react";
import ChatHistory from "../components/Counsellor/ChatHistory";
import ChatInput from "../components/Counsellor/ChatInput";
import SpeechRecognitionButton from "../components/SpeechRecognitionButton";
import useSpeechRecognition from "../hooks/useSpeechRecognition"; // Import custom hook
import useChat from "../hooks/Counsellor/useChat";
import { useTranslation } from "react-i18next";

const CounselorPage = () => {
  const { i18n } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || "";
  const SESSION_ID = "unique-session-id"; //  Replace with actual session ID

  const {
    isListening,
    transcript,
    hasSpeechRecognition,
    speechRecognitionError,
    toggleListen,
    setTranscript
  } = useSpeechRecognition(i18n.language);

  const { messages, loading, sendMessage, t } = useChat(API_URL, SESSION_ID);
    const [input, setInput] = React.useState("");

  // Update input when transcript changes
    React.useEffect(() => {
        setInput(transcript);
    }, [transcript]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-blue-700 text-gray-100 p-6">
      <div className="container mx-auto max-w-2xl bg-white shadow-lg rounded-lg p-6 text-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        </div>
        <ChatHistory messages={messages} loading={loading} t={t} />
        <div className="flex mt-4">
          <ChatInput
            input={input}
            setInput={setInput}
            sendMessage={() => sendMessage(input)}
            t={t}
          />
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
    </div>
  );
};

export default CounselorPage;
