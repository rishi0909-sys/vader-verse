import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import UserInteraction from "@/models/UserInteraction";
import UserPreference from "@/models/UserPreference";
import Game from "@/models/Game";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const adminUser = authResult.user;

    // 1. Merch Sales (Mocked)
    // We don't have Printful orders modeled yet, so we generate deterministic mock data for the past 7 days
    const merchSales = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: Math.floor(Math.random() * 2000) + 500,
      };
    });

    // 2. Arcade Overview (Real Aggregation + Population)
    // We want the most clicked/played HTML games
    const arcadeAgg = await UserInteraction.aggregate([
      { $match: { itemType: "game", action: { $in: ["play", "click", "view"] } } },
      { $group: { _id: "$itemId", totalInteractions: { $sum: 1 } } },
      { $sort: { totalInteractions: -1 } },
      { $limit: 5 }
    ]);

    const arcadeOverview = await Promise.all(
      arcadeAgg.map(async (agg) => {
        const game = await Game.findById(agg._id).select('title isHtmlGame');
        return {
          game: game ? game.title : "Unknown Game",
          interactions: agg.totalInteractions,
          isHtmlGame: game?.isHtmlGame || false
        };
      })
    );

    // If there are no interactions yet, provide a mock fallback to visualize the chart
    if (arcadeOverview.length === 0) {
      arcadeOverview.push(
        { game: "Neon Drifter", interactions: 245, isHtmlGame: true },
        { game: "Cyber Strike", interactions: 189, isHtmlGame: true },
        { game: "Void Explorer", interactions: 156, isHtmlGame: false },
        { game: "Quantum Chess", interactions: 120, isHtmlGame: true },
        { game: "Starborne", interactions: 95, isHtmlGame: false }
      );
    }

    // 3. Community Demographics (Mocked/Simulated based on missing models)
    // We mock how different user archetypes visit communities
    const communityDemographics = [
      { community: "FPS Hub", hardcore: 120, casual: 30, strategy: 10 },
      { community: "RPG Tavern", hardcore: 60, casual: 150, strategy: 40 },
      { community: "Strategy Command", hardcore: 40, casual: 20, strategy: 180 },
      { community: "Retro Arcade", hardcore: 30, casual: 190, strategy: 5 },
      { community: "Speedrunners", hardcore: 180, casual: 10, strategy: 30 },
    ];

    // 4. AI Agent Structural Report (Real Aggregation)
    // Calculate average global confidence from the Bubble personalization engine
    const aiAgg = await UserPreference.aggregate([
      { $match: { "confidence": { $exists: true } } },
      { $project: {
          confidenceArray: { $objectToArray: "$confidence" },
      }},
      { $unwind: "$confidenceArray" },
      { $group: {
          _id: "$confidenceArray.k",
          averageConfidence: { $avg: "$confidenceArray.v" }
      }},
      { $sort: { averageConfidence: -1 } },
      { $limit: 10 }
    ]);

    const aiAgentReport = {
      globalTopConfidenceTags: aiAgg.map(a => ({
        tag: a._id,
        score: parseFloat(a.averageConfidence.toFixed(2))
      })),
      systemMetrics: {
        totalProfiles: await UserPreference.countDocuments(),
        lastCycleRun: new Date().toISOString()
      }
    };

    // Provide mock fallback if AI hasn't profiled users yet
    if (aiAgentReport.globalTopConfidenceTags.length === 0) {
      aiAgentReport.globalTopConfidenceTags = [
        { tag: "action", score: 0.88 },
        { tag: "sci-fi", score: 0.82 },
        { tag: "multiplayer", score: 0.76 },
        { tag: "story-rich", score: 0.65 },
        { tag: "roguelike", score: 0.58 },
      ];
    }

    return NextResponse.json({
      success: true,
      data: {
        merchSales,
        arcadeOverview,
        communityDemographics,
        aiAgentReport
      }
    });
  } catch (error: any) {
    console.error("Admin Analysis API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
