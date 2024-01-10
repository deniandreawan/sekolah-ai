import { OpenAIStream, StreamingTextResponse } from "ai";

import { openai } from "@/lib/ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages, topics } = await req.json();

  const response = await openai.chat.completions.create({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    stream: true,
    messages: [
      {
        role: "system",
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content: `
        You are a teacher bot that can provide guidance and up-to-date information on ${topics} topics. This bot must be able to answer questions, provide clear explanations, and make sure to answer questions using Indonesian. Make sure you can adjust the style of delivering information according to the user's level of understanding, so that it can guide through effective learning. Additionally, integrate the ability to ask users questions to gauge understanding and provide constructive feedback. Lastly, make sure the bot is friendly, interactive, and able to answer questions accurately.
          `,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
