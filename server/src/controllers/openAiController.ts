import OpenAI from "openai";
import { Request, Response, NextFunction} from "express";
import systemPrompt from "../prompts/v1/systemPrompt.ts";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openAiController = async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body
  console.log('userQuery -->', message)

 
  try{
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Change to gpt-4o-mini?
      store: true,
      messages: [
          { "role": "user", "content": message },
          { "role": "system", "content": systemPrompt }
      ]
    });

    console.log('completion --->', completion)
    // competion.choices[0].message.content
    const messages = completion.choices.map((choice) => {
      console.log('choice.message.content ---> ',choice.message)
      return choice.message.content;
    })

     
    res.locals.messages = messages;

    return next();
  } catch (error) {
    return next(error)
  }
}
