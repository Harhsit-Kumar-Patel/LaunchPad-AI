import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Warning: GEMINI_API_KEY is not defined in environment variables. Please set it in .env.local.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");
