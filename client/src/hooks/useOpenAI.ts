import { useState } from "react";
import { chat } from "../api";

export const useOpenAI = () => {
  const [conversationHistory, setConversationHistory] = useState([]);

  const send = async (message: string) => {
    const response = await chat(message, conversationHistory);

    // TODO: Handle error if response.status !== 200
    const data = await response.json();

    setConversationHistory(data.conversationHistory);
  };

  return { conversationHistory, send };
};
