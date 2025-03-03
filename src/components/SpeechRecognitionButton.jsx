// components/SpeechRecognitionButton.jsx
import React from "react"
const SpeechRecognitionButton = ({hasSpeechRecognition, toggleListen, isListening, loading, t, speechRecognitionError}) => {
    return (
    <>
      {hasSpeechRecognition && (
         <button
           onClick={toggleListen}
           className={`ml-2 px-4 py-2 rounded-md ${
             isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
           } text-white`}
           disabled={loading}
         >
           {isListening ? t("stop_listening") : t("start_listening")}
         </button>
       )}
     {!hasSpeechRecognition && (
       <p className="text-red-500 mt-2">{t("speech_recognition_not_supported")}</p>
     )}
     {speechRecognitionError && (
       <p className="text-red-500 mt-2">
         {t("speech_recognition_error")}: {speechRecognitionError}
       </p>
     )}
    </>
    )
}
export default SpeechRecognitionButton;
