import OpenAI from 'openai';
import { Request, Response, NextFunction } from 'express';
import redisClient from '../utils/redisClient.js';
import systemPrompt from '../prompts/v5/systemPrompt.ts';
import structuredOutput from '../prompts/v5/structuredOutput.ts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const sendOpenAiChatMessage = async (req: Request, res: Response, next: NextFunction) => {
  const { message, sessionId } = req.body;

  // Fetch chatHistory and userProfiles from Redis
  let chatHistory = [];
  let userProfiles = [];
  const cachedData = await redisClient.get(sessionId);
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    chatHistory = parsedData.chatHistory || [];
    userProfiles = parsedData.userProfiles || [];
  }

  // If chatHistory is empty, initialize with the system prompt
  if (chatHistory.length === 0) {
    chatHistory.push({ role: 'system', content: systemPrompt });
  }

  // Add the user's new message to chatHistory
  chatHistory.push({ role: 'user', content: message });

  console.log('Chat history:', chatHistory);

  try {
    // Send the chatHistory to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Change to gpt-4o-mini?
      store: true,
      messages: chatHistory,
      temperature: 0.7,
      response_format: { //added response format for structured output
        type: 'json_schema',
        json_schema: structuredOutput
      }
    });

    console.log('\ncompletion w/ structured output --->', completion)

    let assistantMessage;

    if(completion.choices[0].message.content){
      const result = JSON.parse(completion.choices[0].message.content)
      assistantMessage = result.response;
      userProfiles.push(result); // Append the new userProfile to the array
      // console.log('completion result', result)
    }

    console.log('\nassistantMessage --->', assistantMessage)
    console.log('\nuserProfiles output --->', userProfiles)

    // Update chatHistory with the assistant's response
    chatHistory.push({ role: 'assistant', content: assistantMessage });

    // Save updated chatHistory and userProfiles back to Redis with a TTL (e.g., 1 hour)
    const dataToStore = JSON.stringify({ chatHistory, userProfiles });
    await redisClient.set(sessionId, dataToStore, { EX: 360000 });

    res.locals.responseMessage = assistantMessage;

    return next();
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    return next(error);
  }
};

export const generateSummary = async (req: Request, res: Response, next: NextFunction) => {

  const { sessionId } = req.body;

  // Fetch chatHistory and userProfiles from Redis
  let chatHistory = [];
  let userProfiles = [];
  const cachedData = await redisClient.get(sessionId);
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    chatHistory = parsedData.chatHistory || [];
    userProfiles = parsedData.userProfiles || [];
  }

  console.log('Chat history for summary:', chatHistory);
  console.log('User profiles for summary:', userProfiles);

  const summaryPrompt = `
    Analyze the following session log and generate:
      1. Key insights about the learner's strengths.
      2. Patterns observed in their responses.
      3. Specific areas where they need improvement.

    Provide actionable feedback for their next session.

    Session Log:
    ${JSON.stringify(chatHistory)}

    User Profiles Aggregated after each message:
    ${JSON.stringify(userProfiles)}
  `

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      store: true,
      messages: [
        { role: 'system', content: summaryPrompt }
      ]
    });

    const summary = completion.choices[0]?.message?.content;

    res.locals.sessionSummary = summary;

    return next();
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    return next(error);
  }
}

