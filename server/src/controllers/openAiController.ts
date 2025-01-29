import OpenAI from "openai";
import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient.js";
import systemPrompt from "../prompts/v5/systemPrompt.js";
import structuredOutput from '../prompts/v5/structuredOutput.js';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openAiController = async (req: Request, res: Response, next: NextFunction) => {
  const { message, sessionId } = req.body;

  // Fetch chatHistory from Redis
  let chatHistory = [];
  const cachedChatHistory = await redisClient.get(sessionId);
  if (cachedChatHistory) {
    chatHistory = JSON.parse(cachedChatHistory);
  }

  // If chatHistory is empty, initialize with the system prompt
  if (chatHistory.length === 0) {
    chatHistory.push({ role: "system", content: systemPrompt });
  }

  // Add the user's new message to chatHistory
  chatHistory.push({ role: "user", content: message });

  console.log("Chat history:", chatHistory);

  try {
    // Send the chatHistory to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Change to gpt-4o-mini?
      store: true,
      messages: chatHistory,
      temperature: 0.7,
      response_format: { //added response format for structured output
        type: "json_schema",
        json_schema: structuredOutput
      }
    });

    console.log('completion w/ structured output --->', completion)

    let assistantMessage;
    let userProfile;

    if(completion.choices[0].message.content){
      const result = JSON.parse(completion.choices[0].message.content)
      assistantMessage = result.response;
      userProfile = result;
      // console.log('completion result', result)
    }

    // console.log('assistantMessage --->', assistantMessage)
    console.log('userProfile output --->', userProfile)
    console.log('users correct score --->', userProfile.correct_count)
    console.log('users incorrect score --->', userProfile.incorrect_count)

    // Get the assistant's response
    // const assistantMessage = completion.choices[0].message.content;

    // Update chatHistory with the assistant's response
    chatHistory.push({ role: "assistant", content: assistantMessage });

    // Save updated chatHistory back to Redis with a TTL (e.g., 1 hour)
    await redisClient.set(sessionId, JSON.stringify(chatHistory), { EX: 3600 });

    res.locals.responseMessage = assistantMessage;

    return next();
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return next(error);
  }
};

// speech to text and text to speech endpoints
export const transcribeAudio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Received transcribe request');
    const audioFile = req.file; 
    
    if (!audioFile) {
      console.error('No audio file in request');
      throw new Error('No audio file provided');
    }

    console.log('Audio file details:', {
      fieldname: audioFile.fieldname,
      originalname: audioFile.originalname,
      mimetype: audioFile.mimetype,
      size: audioFile.size
    });

    // Create a temporary file from the buffer
    const tempFilePath = `/tmp/${Date.now()}.webm`;
    await fs.promises.writeFile(tempFilePath, audioFile.buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
    });

    // Clean up temp file
    await fs.promises.unlink(tempFilePath);

    console.log('Transcription successful:', transcription.text);
    res.json({ text: transcription.text });
  } catch (error) {
    console.error("Error in Whisper API call:", error);
    res.status(400).json({
      err: error instanceof Error ? error.message : 'Transcription failed',
      details: error
    });
  }
};

export const textToSpeech = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    if (!text) {
      throw new Error('No text provided');
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "sage",
      input: text,
      speed: 1.20
    });

    // Convert to buffer and send
    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set('Content-Type', 'audio/mpeg');
    res.send(buffer);
  } catch (error) {
    console.error("Error in TTS API call:", error);
    next(error);
  }
};

