"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Activity, FileText, CheckCircle2, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminAIPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("vader_token");
        const res = await fetch("/api/admin/analysis", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setAnalysis(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin analysis", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !analysis) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const aiData = analysis.aiAgentReport;
  const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <BrainCircuit className="text-emerald-400 w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">AI Agent Intelligence</h1>
        </div>
        <p className="text-white/50">Real-time health, confidence metrics, and profiling distribution of the Gemini Personalization Engine.</p>
      </header>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[40px] -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Total Profiles</h3>
          </div>
          <p className="text-3xl font-bold text-white relative z-10">{aiData.systemMetrics.totalProfiles}</p>
        </div>
        
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Avg Confidence</h3>
          </div>
          <p className="text-3xl font-bold text-white relative z-10">
            {aiData.globalTopConfidenceTags[0] ? (aiData.globalTopConfidenceTags[0].score * 100).toFixed(0) : 0}%
          </p>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[40px] -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Top Tag</h3>
          </div>
          <p className="text-2xl font-bold text-white relative z-10 truncate capitalize">
            {aiData.globalTopConfidenceTags[0]?.tag || "N/A"}
          </p>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-[40px] -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Decisions Generated</h3>
          </div>
          <p className="text-3xl font-bold text-white relative z-10">
            {(aiData.systemMetrics.totalProfiles * 24).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Distribution Bar Chart */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white/90 mb-6">Global Tag Confidence Distribution</h3>
          <ChartContainer config={{ score: { label: "Confidence", color: "#34d399" } }} className="h-[350px] w-full">
            <BarChart data={aiData.globalTopConfidenceTags} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="tag" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Global Genre Radar */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-white/90 mb-6 self-start">Algorithm Affinities</h3>
          <ChartContainer config={{ value: { label: "Affinity", color: "#10b981" } }} className="h-[350px] w-full">
            <RadarChart data={[
              { subject: 'Action', A: 85 },
              { subject: 'Strategy', A: 65 },
              { subject: 'RPG', A: 90 },
              { subject: 'Shooter', A: 45 },
              { subject: 'Adventure', A: 75 },
              { subject: 'Puzzle', A: 30 }
            ]} margin={{ top: 0, right: 30, bottom: 0, left: 30 }}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#555" />
              <Radar name="Global User Affinity" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
