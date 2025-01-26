const BASE_URL = "http://localhost:3000/api/v1";

const headers = new Headers();
headers.append("Content-Type", "application/json");

export const chat = (message: string, sessionId: string) => {
  return fetch(`${BASE_URL}/chat`, {
    method: "POST",
    body: JSON.stringify({ message, sessionId }),
    headers,
  });
};
