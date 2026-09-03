import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Construct local URLs to call the other health checks
    const url = new URL(req.url);
    const origin = url.origin; // e.g. http://localhost:3000

    const [basicRes, aiRes, persRes] = await Promise.all([
      fetch(`${origin}/api/health`).catch(() => null),
      fetch(`${origin}/api/health/ai`).catch(() => null),
      fetch(`${origin}/api/health/personalization`).catch(() => null)
    ]);

    const basicData = basicRes ? await basicRes.json() : null;
    const aiData = aiRes ? await aiRes.json() : null;
    const persData = persRes ? await persRes.json() : null;

    const checks = {
      server: basicData?.status === "ok" ? "ok" : "failed",
      mongodb: aiData?.checks?.mongodb || "failed",
      gemini: aiData?.checks?.gemini || "failed",
      aiSdk: aiData?.checks?.aiSdk || "failed",
      environment: aiData?.checks?.environment || "failed",
      models: persData?.status === "healthy" ? "ok" : "failed",
      personalization: persData?.checks?.personalizationService || "failed",
      recommendations: persData?.checks?.recommendationEngine || "failed"
    };

    const isHealthy = Object.values(checks).every(v => v === "ok" || v === "skipped");

    return NextResponse.json({
      status: isHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    }, { status: isHealthy ? 200 : 207 });

  } catch (error) {
    return NextResponse.json({
      status: "failed",
      error: "Could not aggregate health checks",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
