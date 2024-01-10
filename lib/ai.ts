import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: "https://api.together.xyz/v1",
});
