// src/hooks/useSpeechRecognition.js
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const useSpeechRecognition = (initialLanguage) => {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = useState(null);
  const recognition = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setHasSpeechRecognition(true);
      try {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = true;
        recognition.current.lang = initialLanguage;

        recognition.current.onresult = (event) => {
          const currentTranscript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setTranscript(currentTranscript);
        };

        recognition.current.onstart = () => {
          setIsListening(true);
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };

        recognition.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setSpeechRecognitionError(event.error);
          setIsListening(false);
        };
      } catch (error) {
      }
    } else {
        setHasSpeechRecognition(false);
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, [initialLanguage]);

  const toggleListen = () => {
    if (!recognition.current) return;

    if (isListening) {
      recognition.current.stop();
    } else {
      setTranscript("");
      try {
        recognition.current.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        setSpeechRecognitionError(error.message);
        setIsListening(false);
      }
    }
  };

  return {
    isListening,
    transcript,
    hasSpeechRecognition,
    speechRecognitionError,
    toggleListen,
    setTranscript
  };
};

export default useSpeechRecognition;