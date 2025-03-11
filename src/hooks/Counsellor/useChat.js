// useChat.js
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

const useChat = (apiUrl, initialSessionId, setInput) => {
  const { t, i18n } = useTranslation("counsellor");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    const newMessage = { text: messageText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/counsellor/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: initialSessionId,
          message: messageText,
          language: i18n.language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); //  Still parse error details as JSON
        let errorMessage = t("error_sending_message");
        if (response.status === 401) {
          errorMessage = t("not_logged_in");
        }
        throw new Error(`Server error: ${response.status} - ${errorData.detail || 'Unknown error'}`); // Use errorData.detail
      }
      setInput("");

      if (!response.body) {
          throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isDone = false;
      let aiResponse = ""; // Accumulate the AI response

      // Add a placeholder message for the AI response *before* starting the stream
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "", sender: "ai", id: Date.now() }, // Use a unique ID
      ]);

      while (!isDone) {
        const { value, done } = await reader.read();
        isDone = done;
        if (value) {
          const decodedChunk = decoder.decode(value, { stream: !done });
          aiResponse += decodedChunk;

          // Update the *last* AI message with the accumulated response
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastAiMessageIndex = newMessages.findLastIndex((msg) => msg.sender === "ai");
            if (lastAiMessageIndex !== -1) {
              newMessages[lastAiMessageIndex] = { ...newMessages[lastAiMessageIndex], text: aiResponse };
            }
            return newMessages;
          });
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: error.message, sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, initialSessionId, i18n.language, t]); // Add dependencies to useCallback

  return { messages, loading, sendMessage, t };
};

export default useChat;