import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // We throw a descriptive error when trying to initialize,
  // but we can also handle it gracefully in the service layer if needed.
  console.warn("WARNING: Missing OPENAI_API_KEY environment variable.");
}

export const openai = new OpenAI({
  apiKey: apiKey || "dummy-key-to-prevent-sdk-crash",
});

export function checkOpenAIConfiguration(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
