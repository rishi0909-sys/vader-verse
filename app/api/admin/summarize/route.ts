import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const body = await req.json();
    const { stats, analysis } = body;

    if (!stats || !analysis) {
      return NextResponse.json({ success: false, message: "Missing analysis data to summarize." }, { status: 400 });
    }

    const promptContext = `
You are the Vader-Verse AI Administrator Assistant.
You have been asked to provide a "short and sweet" summary of the platform's current health and analytics without missing any critical details.

CURRENT STATS:
Pending Tournaments: ${stats.pendingTournaments}
Pending Reports: ${stats.pendingReports}
Reviewed Reports: ${stats.reviewedReports}
Action Taken: ${stats.actionTaken}

SYSTEM ANALYSIS:
Merch Revenue: ${analysis.merchSales?.reduce((acc: number, curr: any) => acc + curr.revenue, 0) || 0}
Merch Sales Volume: ${analysis.merchSales?.reduce((acc: number, curr: any) => acc + curr.sales, 0) || 0}
Top Arcade Game: ${analysis.arcadeOverview?.[0]?.game || "N/A"} (${analysis.arcadeOverview?.[0]?.interactions || 0} clicks)
Global AI Top Tag: ${analysis.aiAgentReport?.globalTopConfidenceTags?.[0]?.tag || "N/A"} (Confidence: ${((analysis.aiAgentReport?.globalTopConfidenceTags?.[0]?.score || 0) * 100).toFixed(0)}%)
Total Profiles Analyzed: ${analysis.aiAgentReport?.systemMetrics?.totalProfiles || 0}

Provide a 2-3 paragraph professional, yet exciting executive summary of these metrics. Address the admin directly. Highlight any areas that need attention (e.g., pending reports/tournaments) and celebrate the successes (e.g., revenue, engagement).
`;

    const { text } = await generateText({
      model: google("gemini-3.6-flash"),
      prompt: promptContext,
    });

    return NextResponse.json({ success: true, summary: text });
  } catch (error: any) {
    console.error("Admin Summarize POST Error:", error);
    return NextResponse.json({ success: false, message: "Failed to generate AI summary." }, { status: 500 });
  }
}
