import { useState } from "react";
import { chat } from "../api";

export const useOpenAI = (sessionId) => {
  const [responseMessage, setResponseMessage] = useState("");

  const send = async (message: string) => {
    const response = await chat(message, sessionId);

    // TODO: Handle error if response.status !== 200
    const data = await response.json();

    setResponseMessage(data.responseMessage);
  };

  const resetResponsMessage = () => {
    setResponseMessage("");
  };

  return { responseMessage, send, resetResponsMessage };
};
