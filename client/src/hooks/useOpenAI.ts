import { useState } from "react";
import { chat } from "../api";

export const useOpenAI = (sessionId: string) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseMessageSummary, setResponseMessageSummary] = useState("");

  const send = async (message: string) => {
    const response = await chat(message, sessionId);

    // TODO: Handle error if response.status !== 200
    const data = await response.json();
    const cleanMessage = JSON.parse(data.responseMessage);
    console.log('Responding message', JSON.parse(data.responseMessage))
    setResponseMessage(cleanMessage.response);
    setResponseMessageSummary(cleanMessage);
  };

  const resetResponsMessage = () => {
    setResponseMessage("");
  };

  return { responseMessage, send, resetResponsMessage, responseMessageSummary };
};