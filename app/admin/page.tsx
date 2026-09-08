"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, ShieldCheck, Flag, BarChart3, TrendingUp, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, AreaChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    pendingTournaments: 0,
    pendingReports: 0,
    reviewedReports: 0,
    actionTaken: 0
  });
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("vader_token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch basic counts and analysis data in parallel
        const [tournamentsRes, reportsRes, analysisRes] = await Promise.all([
          fetch("/api/admin/tournaments?status=pending_approval", { headers }),
          fetch("/api/admin/reports", { headers }),
          fetch("/api/admin/analysis", { headers })
        ]);

        if (tournamentsRes.ok && reportsRes.ok) {
          const tData = await tournamentsRes.json();
          const rData = await reportsRes.json();
          const aData = await analysisRes.json();

          const tPending = tData.data?.length || 0;
          const reports = rData.data || [];
          
          setStats({
            pendingTournaments: tPending,
            pendingReports: reports.filter((r: any) => r.status === "pending").length,
            reviewedReports: reports.filter((r: any) => r.status === "reviewed").length,
            actionTaken: reports.filter((r: any) => r.status === "action_taken").length,
          });

          if (aData.success) {
            setAnalysis(aData.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSummarize = async () => {
    setGeneratingSummary(true);
    try {
      const token = localStorage.getItem("vader_token");
      const res = await fetch("/api/admin/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stats, analysis }),
      });
      const data = await res.json();
      if (data.success) {
        setAiSummary(data.summary);
      }
    } catch (err) {
      console.error("Failed to generate summary", err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  if (loading || !analysis) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Chart Configs
  const merchConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--chart-1, 340 70% 50%))" },
    sales: { label: "Sales Volume", color: "hsl(var(--chart-2, 0 70% 50%))" },
  };

  const arcadeConfig = {
    interactions: { label: "Clicks / Plays", color: "hsl(var(--chart-3, 270 70% 60%))" },
  };

  const communityConfig = {
    hardcore: { label: "Hardcore", color: "#f87171" },
    casual: { label: "Casual", color: "#60a5fa" },
    strategy: { label: "Strategy", color: "#a78bfa" },
  };

  const aiConfig = {
    score: { label: "Confidence", color: "#34d399" },
  };

  const COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#06b6d4', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">System Overview</h1>
          <p className="text-white/50 mt-2">Real-time moderation statistics and system analysis.</p>
        </div>
        <button
          onClick={handleSummarize}
          disabled={generatingSummary}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl transition-all font-semibold text-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {generatingSummary ? "Analyzing Platform..." : "Executive AI Summary"}
        </button>
      </header>

      {aiSummary && (
        <div className="bg-gradient-to-br from-emerald-900/20 to-blue-900/20 border border-emerald-500/20 backdrop-blur-md p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-10 -mt-10 pointer-events-none" />
          <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Gemini Executive Report
          </h3>
          <div className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed max-w-4xl relative z-10">
            {aiSummary}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium text-sm">Pending Tournaments</h3>
            <Activity className="text-red-400 w-5 h-5" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.pendingTournaments}</p>
          <div className="mt-4">
            <Link href="/admin/tournaments" className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider font-semibold">
              Review Queue →
            </Link>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium text-sm">Pending Reports</h3>
            <Flag className="text-yellow-400 w-5 h-5" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.pendingReports}</p>
          <div className="mt-4">
            <Link href="/admin/reports" className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors uppercase tracking-wider font-semibold">
              Review Queue →
            </Link>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium text-sm">Reviewed (Total)</h3>
            <Clock className="text-green-400 w-5 h-5" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.reviewedReports}</p>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium text-sm">Action Taken</h3>
            <ShieldCheck className="text-purple-400 w-5 h-5" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.actionTaken}</p>
        </div>
      </div>

      {/* Analysis Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Merch Sales Area Chart */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-pink-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-white/90">Merch Sales Overview</h3>
          </div>
          <ChartContainer config={merchConfig} className="h-[300px] w-full">
            <AreaChart data={analysis.merchSales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Arcade Overview Bar Chart */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-purple-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-white/90">Arcade Clicks (Top Games)</h3>
          </div>
          <ChartContainer config={arcadeConfig} className="h-[300px] w-full">
            <BarChart data={analysis.arcadeOverview} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="game" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="interactions" fill="var(--color-interactions)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Community Demographics Radar Chart */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-blue-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-white/90">Community Persona Demographics</h3>
          </div>
          <ChartContainer config={communityConfig} className="h-[300px] w-full">
            <RadarChart data={analysis.communityDemographics} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="community" stroke="#888" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#555" />
              <Radar name="Hardcore" dataKey="hardcore" stroke="var(--color-hardcore)" fill="var(--color-hardcore)" fillOpacity={0.5} />
              <Radar name="Casual" dataKey="casual" stroke="var(--color-casual)" fill="var(--color-casual)" fillOpacity={0.5} />
              <Radar name="Strategy" dataKey="strategy" stroke="var(--color-strategy)" fill="var(--color-strategy)" fillOpacity={0.5} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </div>

        {/* AI Agent Report Radial / Pie */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col relative">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-emerald-500 w-5 h-5" />
            <h3 className="text-lg font-bold text-white/90">AI Personalization Agent Health</h3>
          </div>
          <div className="flex h-full items-center">
            <div className="w-1/2">
              <ChartContainer config={aiConfig} className="h-[250px] w-full">
                <PieChart>
                  <Pie
                    data={analysis.aiAgentReport.globalTopConfidenceTags}
                    dataKey="score"
                    nameKey="tag"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {analysis.aiAgentReport.globalTopConfidenceTags.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div className="w-1/2 flex flex-col justify-center space-y-4 pl-4">
              <div>
                <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Global Top Tag</p>
                <p className="text-emerald-400 text-xl font-black capitalize">
                  {analysis.aiAgentReport.globalTopConfidenceTags[0]?.tag || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Avg Confidence Score</p>
                <p className="text-white/90 text-2xl font-bold">
                  {(analysis.aiAgentReport.globalTopConfidenceTags[0]?.score * 100).toFixed(0) || 0}%
                </p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">Total Profiles Analyzed</p>
                <p className="text-white/90 text-2xl font-bold">
                  {analysis.aiAgentReport.systemMetrics.totalProfiles}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
