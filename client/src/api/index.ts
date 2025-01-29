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

export const transcribeAudio = async (audioFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await fetch(`${BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Transcription failed:', errorText);
    throw new Error('Transcription failed');
  }

  const data = await response.json();
  return data.text;
};

export const textToSpeech = async (text: string): Promise<ArrayBuffer> => {
  const response = await fetch(`${BASE_URL}/text-to-speech`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Text-to-speech failed');
  }

  return response.arrayBuffer();
};


