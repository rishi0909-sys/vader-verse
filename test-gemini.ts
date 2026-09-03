import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  try {
    await generateText({
      model: google("gemini-3.6-flash"),
      prompt: "Respond with exactly one word: 'ok'",
    });
    console.log("Success with gemini-3.6-flash");
  } catch (e: any) {
    console.error("Gemini failed:", e.message);
  }
}
run();
