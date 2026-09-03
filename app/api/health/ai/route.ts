import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function GET() {
  const checks = {
    mongodb: "pending",
    gemini: "pending",
    aiSdk: "ok", // if this code executes, the SDK is loaded
    environment: "pending",
    models: "ok", // just a status indicator
  };

  try {
    // 1. Environment variables
    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      checks.environment = "missing_mongo_uri";
    } else if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      checks.environment = "missing_google_api_key";
    } else {
      checks.environment = "ok";
    }

    // 2. Database connection
    try {
      await dbConnect();
      checks.mongodb = mongoose.connection.readyState === 1 ? "ok" : "failed";
    } catch (e) {
      checks.mongodb = "failed";
    }

    // 3. Gemini Test
    try {
      if (checks.environment === "ok") {
        await generateText({
          model: google("gemini-3.6-flash"),
          prompt: "Respond with exactly one word: 'ok'",
        });
        checks.gemini = "ok";
      } else {
        checks.gemini = "skipped";
      }
    } catch (e: any) {
      checks.gemini = "failed";
      console.error("[Diagnostic Error] Gemini test failed:");
      console.error("- Model: models/gemini-1.5-flash-latest");
      console.error("- Message:", e.message || e);
      if (e.statusCode || (e.response && e.response.status)) {
        console.error("- HTTP Status:", e.statusCode || e.response.status);
      }
      if (e.code) {
        console.error("- Error Code:", e.code);
      }
    }

    const isHealthy = Object.values(checks).every(v => v === "ok" || v === "skipped");

    return NextResponse.json({
      status: isHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    }, { status: isHealthy ? 200 : 207 }); // 207 Multi-Status for degraded
  } catch (error) {
    return NextResponse.json({
      status: "degraded",
      checks,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
