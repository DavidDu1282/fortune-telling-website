// src/pages/CounsellorPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "react-i18next";
import useChat from "../hooks/Counsellor/useChat";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import ChatSession from "../components/Counsellor/ChatSession";

const CounselorPage = () => {
  const { i18n, t } = useTranslation("counsellor");
  const API_URL = import.meta.env.VITE_API_URL || "";

  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState({}); // { tabId: { sessionId } }
  const [nextTabId, setNextTabId] = useState(1);
  const [inputs, setInputs] = useState({}); // {tabId: input}
  const chatDataRef = useRef({}); // { tabId: { messages, loading, sendMessage } }

  const {
    isListening,
    transcript,
    hasSpeechRecognition,
    speechRecognitionError,
    toggleListen,
  } = useSpeechRecognition(i18n.language);

  // Function to add a new tab
  const addTab = () => {
    const newTabId = nextTabId;
    setNextTabId(prevId => prevId + 1);
    const newSessionId = uuidv4();

    setTabs(prevTabs => ({
      ...prevTabs,
      [newTabId]: { sessionId: newSessionId },
    }));
    setInputs(prevInputs => ({
      ...prevInputs,
      [newTabId]: "" // Initialize input
    }));
    setActiveTab(newTabId);
  };

  // Function to remove a tab
  const removeTab = (tabId) => {
    setTabs(prevTabs => {
      const newTabs = { ...prevTabs };
      delete newTabs[tabId];

      if (activeTab === tabId) {
        const remainingTabIds = Object.keys(newTabs).map(Number); // Convert to numbers
        setActiveTab(remainingTabIds.length > 0 ? remainingTabIds[0] : null);
      }
      return newTabs;
    });
    setInputs(prevInputs => {
      const newInputs = { ...prevInputs };
      delete newInputs[tabId];
      return newInputs;
    });
  };

  // Function to handle input changes
  const handleInputChange = (tabId, value) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [tabId]: value
    }));
  };

  // Update input with transcript
  useEffect(() => {
    if (activeTab && tabs[activeTab]) {
      handleInputChange(activeTab, transcript);
    }
  }, [transcript, activeTab, tabs]);

  // Initialize the first tab on mount
  useEffect(() => {
    if (Object.keys(tabs).length === 0) {
      addTab();
    }
  }, []);

  // Initialize useChat hooks
  for (let i = 1; i <= 10; i++) {
    const sessionId = tabs[i]?.sessionId || uuidv4();
    const setInputForTab = (value) => handleInputChange(i, value);
    chatDataRef.current[i] = useChat(API_URL, sessionId, setInputForTab);
  }

  return (
    // <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-blue-700 text-gray-100 p-6 flex items-center justify-center">
      <div className="min-h-screen container mx-auto bg-gray-800 shadow-lg rounded-lg p-6 text-gray-100 flex flex-col h-[80vh]"> {/* Changed bg-white to bg-gray-800, text-gray-900 to text-gray-100, h-[80vh] to h-[90vh] */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <button
            onClick={addTab}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("addTab")}
          </button>
        </div>

        {/* Tab List */}
        <div> {/* Removed border-b */}
          {Object.keys(tabs).map((tabIdStr) => {
            const tabId = parseInt(tabIdStr); // Convert to number for comparison
            return (
              <button
                key={tabId}
                className={`px-4 py-2 rounded-t-lg  font-semibold ${
                  activeTab === tabId
                    ? "bg-blue-600 text-white"  // Active tab style
                    : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-white" // Inactive tab style.  Changed bg-gray-200
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                onClick={() => setActiveTab(tabId)}
              >
                {t("tab")} {tabId}
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent tab switch
                    removeTab(tabId);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                >
                  &times;
                </span>
              </button>
            );
          })}
        </div>


        {/* Chat Session */}
        {activeTab !== null && tabs[activeTab] && chatDataRef.current[activeTab] && (
          <div className="flex-grow"> {/* Added flex-grow to take up more space */}
          <ChatSession
            messages={chatDataRef.current[activeTab].messages}
            loading={chatDataRef.current[activeTab].loading}
            sendMessage={() => chatDataRef.current[activeTab].sendMessage(inputs[activeTab])}
            input={inputs[activeTab]}
            setInput={(value) => handleInputChange(activeTab, value)}
            t={t}
            isListening={isListening}
            toggleListen={toggleListen}
            hasSpeechRecognition={hasSpeechRecognition}
            speechRecognitionError={speechRecognitionError}
          />
        </div>
        )}
      </div>
    // </div>
  );
};

export default CounselorPage;

// // fortune-telling-website\src\pages\CounsellorPage.jsx
// import React, { useState, useEffect } from "react";
// import ChatHistory from "../components/Counsellor/ChatHistory";
// import ChatInput from "../components/Counsellor/ChatInput";
// import { v4 as uuidv4 } from 'uuid';
// import { useTranslation } from "react-i18next";
// import useChat from "../hooks/Counsellor/useChat";
// import useSpeechRecognition from "../hooks/useSpeechRecognition";

// const CounselorPage = () => {
//   const { i18n, t } = useTranslation("counsellor");
//   const API_URL = import.meta.env.VITE_API_URL || "";
//   const [sessionId, setSessionId] = useState(uuidv4());
//   const [input, setInput] = React.useState("");

//   const {
//     isListening,
//     transcript,
//     hasSpeechRecognition,
//     speechRecognitionError,
//     toggleListen,
//   } = useSpeechRecognition(i18n.language);

//   const { messages, loading, sendMessage,  } = useChat(API_URL, sessionId, setInput);

//   useEffect(() => {
//     setInput(transcript)
//   }, [transcript])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-blue-700 text-gray-100 p-6">
//       <div className="container mx-auto max-w-2xl bg-white shadow-lg rounded-lg p-6 text-gray-900 flex flex-col h-full"> {/* Added flex flex-col h-full */}
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
//         </div>
//         <div className="h-[60vh] overflow-y-auto">
//           <ChatHistory messages={messages} loading={loading} t={t} />
//         </div>
//         <div className="mt-4">
//           <ChatInput
//             input={input}
//             setInput={setInput}
//             sendMessage={() => sendMessage(input)}
//             t={t}
//             isListening={isListening}
//             toggleListen={toggleListen}
//             hasSpeechRecognition={hasSpeechRecognition}
//             speechRecognitionError={speechRecognitionError}
//             loading={loading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CounselorPage;
