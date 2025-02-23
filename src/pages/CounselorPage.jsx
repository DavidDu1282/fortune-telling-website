import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

const CounsellorPage = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "";
  const recognition = useRef(null);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = useState(null); // State to hold specific errors

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setHasSpeechRecognition(true);
      try {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = true;
        recognition.current.lang = i18n.language;

        recognition.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInput(transcript);
        };

        recognition.current.onstart = () => {
          setIsListening(true);
          console.log("Speech recognition started"); // Debugging
        };

        recognition.current.onend = () => {
          setIsListening(false);
          console.log("Speech recognition ended"); // Debugging
          return;
        };

        recognition.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setSpeechRecognitionError(event.error); //Store the error.
          setIsListening(false);
          console.log("Speech recognition error:", event); // More detailed debug info

          if (event.error === 'no-speech') {
            console.warn("No speech was detected. Adjust microphone settings or speak louder.");
          } else if (event.error === 'audio-capture') {
            console.error("Audio capture failed. Check microphone permissions.");
          } else if (event.error === 'not-allowed') {
            console.error("Speech recognition access was denied. Check browser permissions.");
          }

        };
      } catch (error) {
        console.error("Error initializing SpeechRecognition:", error);
        setHasSpeechRecognition(false);
        setSpeechRecognitionError(error.message); // Store initialization error

      }
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, [i18n.language]);

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

  const toggleListen = () => {
    if (!recognition.current) return;

    if (isListening) {
      recognition.current.stop();
      console.log("Stopping recognition"); //Debugging
    } else {
      setInput("");
      try {
        recognition.current.start();
        console.log("Starting recognition"); //Debugging
      } catch (error) {
        console.error("Error starting recognition:", error);
        setSpeechRecognitionError(error.message);  //Capture specific start error
        setIsListening(false); // Ensure isListening is false if start fails
      }
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

          {hasSpeechRecognition && (
            <button
              onClick={toggleListen}
              className={`ml-2 px-4 py-2 rounded-md ${
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              } text-white`}
              disabled={loading}
            >
              {isListening ? t("counsellor_stop_listening") : t("counsellor_start_listening")}
            </button>
          )}
        </div>
        {!hasSpeechRecognition && (
          <p className="text-red-500 mt-2">{t("counsellor_speech_recognition_not_supported")}</p>
        )}
        {speechRecognitionError && (
          <p className="text-red-500 mt-2">
            {t("counsellor_speech_recognition_error")}: {speechRecognitionError}
          </p>
        )}
      </div>
    </div>
  );
};

export default CounsellorPage;