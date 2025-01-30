import { useState } from "react";
import { chat, summary } from "../api";

export const useOpenAI = (sessionId: string) => {
  const [responseMessage, setResponseMessage] = useState("");

  const send = async (message: string) => {
    const response = await chat(message, sessionId);

    // TODO: Handle error if response.status !== 200
    const data = await response.json();
    setResponseMessage(data.responseMessage);
  };

  const getSummary = async (summarySessionId: string) => {
    const response = await summary(summarySessionId);

    // TODO: Handle error if response.status !== 200
    const data = await response.json();

    console.log('Session summary -> ', data);
    console.log('Respnse', response)

    setResponseMessage(data.sessionSummary);
  };

  const resetResponsMessage = () => {
    setResponseMessage("");
  };

  return { responseMessage, send, resetResponsMessage, getSummary };
};