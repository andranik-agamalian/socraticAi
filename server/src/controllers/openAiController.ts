import OpenAI from "openai";
import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient.js";
import systemPrompt from "../prompts/v5/systemPrompt.ts";
import structuredOutput from '../prompts/v5/structuredOutput.ts';

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

    // console.log('completion w/ structured output --->', completion)

    let assistantMessage;
    let userProfile;

    if(completion.choices[0].message.content){
      const result = JSON.parse(completion.choices[0].message.content)
      assistantMessage = result.response;
      userProfile = result;
      // console.log('completion result', result)
    }

    console.log('assistantMessage --->', assistantMessage)
    console.log('userProfile output --->', userProfile)

    // Get the assistant's response
    // const assistantMessage = completion.choices[0].message.content;

    // Update chatHistory with the assistant's response
    chatHistory.push({ role: "assistant", content: assistantMessage });

    // Save updated chatHistory back to Redis with a TTL (e.g., 1 hour)
    // await redisClient.set(sessionId, JSON.stringify(chatHistory), { EX: 3600 });
    await redisClient.set(sessionId, JSON.stringify(chatHistory), { EX: 3600});


    res.locals.responseMessage = assistantMessage;

    return next();
  } catch (error) {
    console.error("Error in OpenAI API call:", error);
    return next(error);
  }
};

