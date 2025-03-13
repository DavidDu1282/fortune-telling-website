// counsellorChatApi.js

const sendMessageToApi = async (apiUrl, sessionId, messageText, language) => {
  const response = await fetch(`${apiUrl}/api/counsellor/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: messageText,
      language: language,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    let errorMessage = "Error sending message"; // Default error, can be overridden by specific error
    if (response.status === 401) {
      errorMessage = "Not logged in"; //  Specific error message
    }
    throw new Error(
      `Server error: ${response.status} - ${errorData.detail || "Unknown error"}` // More detailed error
    );
  }

  if (!response.body) {
    throw new Error("ReadableStream not supported in this browser.");
  }

  return response.body;
};

const readStream = async (reader, decoder, onChunkReceived, onComplete) => {
  let isDone = false;
  let aiResponse = "";

  while (!isDone) {
    const { value, done } = await reader.read();
    isDone = done;
    if (value) {
      const decodedChunk = decoder.decode(value, { stream: !done });
      aiResponse += decodedChunk;
      onChunkReceived(aiResponse); // Callback for each chunk
    }
  }

  onComplete(); // Callback when stream is complete
  return aiResponse;
};

export { sendMessageToApi, readStream };
