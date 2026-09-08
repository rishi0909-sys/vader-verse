"use client";

import { useEffect, useState } from "react";
import { UsersRound, MessageSquareText, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminCommunitiesPage() {
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

  const communityConfig = {
    hardcore: { label: "Hardcore", color: "#f87171" },
    casual: { label: "Casual", color: "#60a5fa" },
    strategy: { label: "Strategy", color: "#a78bfa" },
  };

  const mockGrowth = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short' }),
      members: Math.floor(1000 + i * 50 + Math.random() * 20),
      messages: Math.floor(5000 + i * 200 + Math.random() * 100),
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <UsersRound className="text-blue-400 w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Communities</h1>
        </div>
        <p className="text-white/50">Demographics, engagement tracking, and cross-pollination analysis across hubs.</p>
      </header>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <UsersRound className="w-4 h-4 text-blue-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Total Members</h3>
          </div>
          <p className="text-3xl font-bold text-white flex items-end gap-2">
            1,342 <span className="text-sm text-emerald-400 font-semibold mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> 12%</span>
          </p>
        </div>
        
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquareText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Msgs (24h)</h3>
          </div>
          <p className="text-3xl font-bold text-white flex items-end gap-2">
            6,420 <span className="text-sm text-emerald-400 font-semibold mb-1 flex items-center"><ArrowUpRight className="w-3 h-3" /> 8%</span>
          </p>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Flags (24h)</h3>
          </div>
          <p className="text-3xl font-bold text-white flex items-end gap-2">
            3 <span className="text-sm text-white/40 font-semibold mb-1">Stable</span>
          </p>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group flex flex-col justify-center">
          <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider mb-2">Most Active Hub</h3>
          <p className="text-lg font-bold text-blue-400 truncate">FPS Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center">
          <h3 className="text-lg font-bold text-white/90 mb-6 self-start">Persona Intersections</h3>
          <ChartContainer config={communityConfig} className="h-[350px] w-full">
            <RadarChart data={analysis.communityDemographics} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="community" stroke="#888" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#555" />
              <Radar name="Hardcore" dataKey="hardcore" stroke="var(--color-hardcore)" fill="var(--color-hardcore)" fillOpacity={0.3} />
              <Radar name="Casual" dataKey="casual" stroke="var(--color-casual)" fill="var(--color-casual)" fillOpacity={0.3} />
              <Radar name="Strategy" dataKey="strategy" stroke="var(--color-strategy)" fill="var(--color-strategy)" fillOpacity={0.3} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </div>

        {/* Growth Line Chart */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white/90 mb-6">Engagement Growth (7d)</h3>
          <ChartContainer config={{ messages: { label: "Messages Sent", color: "#10b981" } }} className="h-[350px] w-full">
            <LineChart data={mockGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="messages" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
