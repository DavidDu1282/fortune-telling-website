// components/Counsellor/ChatInput.jsx
 import React from "react"
const ChatInput = ({input, setInput, sendMessage, t}) => {
    return(
        <>
        <input
         type="text"
         value={input}
         onChange={(e) => setInput(e.target.value)}
         className="flex-grow p-2 border rounded-md bg-gray-200 text-gray-900"
         placeholder={t("input_placeholder")}
         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
       />
       <button
         onClick={sendMessage}
         className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
       >
         {t("send")}
       </button>
       </>
    )
}
export default ChatInput