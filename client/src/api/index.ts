import { Conversation } from "../types";

const BASE_URL = "http://localhost:3000/api/v1";

const headers = new Headers();
headers.append("Content-Type", "application/json");

export const chat = (message: string, conversationHistory: Conversation[]) => {
  return fetch(`${BASE_URL}/chat`, {
    method: "POST",
    body: JSON.stringify({ message, conversationHistory }),
    headers,
  });
};
