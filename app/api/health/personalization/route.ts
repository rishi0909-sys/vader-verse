import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  const checks = {
    database: "pending",
    userInteractionModel: "pending",
    userPreferenceModel: "pending",
    gameModel: "pending",
    personalizationService: "pending",
    recommendationEngine: "pending",
  };

  try {
    await dbConnect();
    checks.database = "ok";

    // Dynamic imports to catch import/syntax errors at runtime during health check
    try {
      const UserInteraction = (await import("@/models/UserInteraction")).default;
      checks.userInteractionModel = UserInteraction ? "ok" : "failed";
    } catch (e) { checks.userInteractionModel = "failed"; }

    try {
      const UserPreference = (await import("@/models/UserPreference")).default;
      checks.userPreferenceModel = UserPreference ? "ok" : "failed";
    } catch (e) { checks.userPreferenceModel = "failed"; }

    try {
      const Game = (await import("@/models/Game")).default;
      checks.gameModel = Game ? "ok" : "failed";
    } catch (e) { checks.gameModel = "failed"; }

    try {
      const aiService = await import("@/services/aiPersonalizationService");
      checks.personalizationService = (typeof aiService.processUserPersonalization === "function") ? "ok" : "failed";
    } catch (e) { checks.personalizationService = "failed"; }

    try {
      const recEngine = await import("@/services/recommendationEngine");
      checks.recommendationEngine = (typeof recEngine.getGameRecommendations === "function") ? "ok" : "failed";
    } catch (e) { checks.recommendationEngine = "failed"; }

    const isHealthy = Object.values(checks).every(v => v === "ok");

    return NextResponse.json({
      status: isHealthy ? "healthy" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    }, { status: isHealthy ? 200 : 207 });

  } catch (error) {
    return NextResponse.json({
      status: "degraded",
      checks,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
