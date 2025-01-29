import { useState, useCallback, useRef } from 'react';
import { transcribeAudio, textToSpeech } from '../api';

export const useVoiceControls = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    console.log('Starting recording...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Got microphone access');
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available from microphone');
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsListening(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    console.log('Stopping recording...');
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        console.error('No media recorder found');
        reject('No media recorder found');
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          console.log('Creating audio blob');
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: 'audio/webm'
          });
          
          const audioFile = new File([audioBlob], 'recording.webm', {
            type: 'audio/webm',
            lastModified: Date.now()
          });
          
          console.log('Sending to transcription');
          const text = await transcribeAudio(audioFile);
          setIsListening(false);
          console.log('Got transcription:', text);
          resolve(text);
        } catch (error) {
          console.error('Transcription error:', error);
          reject(error);
        }
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      const audioBuffer = await textToSpeech(text);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    startRecording,
    stopRecording,
    speak
  };
}; 