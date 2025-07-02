import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, topics } = await req.json();

  const result = streamText({
    model: openrouter.chat("openai/gpt-4o-mini"),
    messages: [
      {
        role: "system",

        content: `
        You are a teacher bot that can provide guidance and up-to-date information on ${topics} topics. This bot must be able to answer questions, provide clear explanations, and make sure to answer questions using Indonesian. Make sure you can adjust the style of delivering information according to the user's level of understanding, so that it can guide through effective learning. Additionally, integrate the ability to ask users questions to gauge understanding and provide constructive feedback. Lastly, make sure the bot is friendly, interactive, and able to answer questions accurately.
          `,
      },
      ...messages,
    ],
  });

  result.consumeStream();

  const response = result.toDataStreamResponse();

  return new Response(response.body, {
    status: response.status,
    headers: new Headers(response.headers),
  });
}
