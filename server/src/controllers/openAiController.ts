import OpenAI from "openai";
import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient.js";
import systemPrompt from "../prompts/v1/systemPrompt.ts";

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
    });

    // Get the assistant's response
    const assistantMessage = completion.choices[0].message.content;

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

