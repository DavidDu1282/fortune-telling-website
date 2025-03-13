// useChat.js
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { sendMessageToApi, readStream } from "../../api/Counsellor/counsellorChatApi"; // Import API functions

const useChat = (apiUrl, initialSessionId, setInput) => {
  const { t, i18n } = useTranslation("counsellor");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim()) return;

      const newMessage = { text: messageText, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setLoading(true);

      try {
        const stream = await sendMessageToApi(
          apiUrl,
          initialSessionId,
          messageText,
          i18n.language
        );
        setInput("");
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        // Add AI placeholder
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "", sender: "ai", id: Date.now() },
        ]);

        //  Read the streamed response
        await readStream(
          reader,
          decoder,
          (aiResponse) => {
            // onChunkReceived callback
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];
              const lastAiMessageIndex = newMessages.findLastIndex(
                (msg) => msg.sender === "ai"
              );
              if (lastAiMessageIndex !== -1) {
                newMessages[lastAiMessageIndex] = {
                  ...newMessages[lastAiMessageIndex],
                  text: aiResponse,
                };
              }
              return newMessages;
            });
          },
          () => {
            // onComplete callback (nothing specific here, but could be used for cleanup)
          }
        );
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: error.message, sender: "ai" },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, initialSessionId, i18n.language, setInput]
  ); // Correct dependencies

  return { messages, loading, sendMessage, t };
};

export default useChat;