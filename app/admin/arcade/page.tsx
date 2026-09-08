"use client";

import { useEffect, useState } from "react";
import { Gamepad2, MousePointerClick, Clock, TrendingUp, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminArcadePage() {
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

  const arcadeConfig = {
    interactions: { label: "Clicks / Plays", color: "hsl(var(--chart-3, 270 70% 60%))" },
    duration: { label: "Avg Session (mins)", color: "hsl(var(--chart-2, 180 70% 50%))" }
  };

  // Mock historical data for deeper charts, since DB doesn't have timeseries for everything yet
  const mockTimeseries = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString(undefined, { weekday: 'short' }),
      players: Math.floor(Math.random() * 500) + 200,
      sessions: Math.floor(Math.random() * 800) + 300,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Gamepad2 className="text-purple-400 w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Arcade Analytics</h1>
        </div>
        <p className="text-white/50">Detailed engagement metrics, session durations, and game performance.</p>
      </header>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <MousePointerClick className="w-4 h-4 text-purple-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Total Interactions</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {analysis.arcadeOverview.reduce((acc: number, curr: any) => acc + curr.interactions, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Avg Session Time</h3>
          </div>
          <p className="text-3xl font-bold text-white">42m</p>
        </div>
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Active Players (24h)</h3>
          </div>
          <p className="text-3xl font-bold text-white">1,204</p>
        </div>
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Top Trending</h3>
          </div>
          <p className="text-xl font-bold text-white truncate">{analysis.arcadeOverview[0]?.game || "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Interactions Deep Dive */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white/90 mb-6">Interaction Volume by Game</h3>
          <ChartContainer config={arcadeConfig} className="h-[350px] w-full">
            <BarChart data={analysis.arcadeOverview} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="game" stroke="#888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="interactions" fill="var(--color-interactions)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Traffic Timeseries */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white/90 mb-6">7-Day Global Traffic</h3>
          <ChartContainer config={{ players: { label: "Unique Players", color: "#60a5fa" } }} className="h-[350px] w-full">
            <AreaChart data={mockTimeseries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="players" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorPlayers)" />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
