// useChat.js (New File - Custom Hook)
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useChat = (apiUrl, initialSessionId) => {
    const { t, i18n } = useTranslation("counsellor");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (messageText) => {
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
                const errorData = await response.json();
                let errorMessage = t("error_sending_message");
                if (response.status === 401) {
                    errorMessage = t("not_logged_in");
                }
                throw new Error(`Server error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const result = await response.json();

            if (result && result.response) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.response, sender: "ai" },
                ]);
            } else {
                console.error("Invalid response from server:", result);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: t("invalid_response"), sender: "ai" },
                ]);
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
    };
    return { messages, loading, sendMessage, t };
};
export default useChat;
