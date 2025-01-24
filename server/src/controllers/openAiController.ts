import OpenAI from "openai";
import { Request, Response, NextFunction} from "express";
import systemPrompt from "../prompts/v1/systemPrompt.ts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openAiController = async (req: Request, res: Response, next: NextFunction) => {
  const { message, conversationHistory } = req.body

  if (conversationHistory.length) {
    conversationHistory.push({ role: 'user', content: message})
  } else {
    conversationHistory.push({ "role": "user", "content": message })
    conversationHistory.push({ "role": "system", "content": systemPrompt })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Change to gpt-4o-mini?
      store: true,
      messages: conversationHistory
    });

    const message = completion.choices[0].message.content;
    res.locals.conversationHistory = [...conversationHistory, { role: 'assistant', content: message }];

    return next();
  } catch (error) {
    return next(error)
  }
}
