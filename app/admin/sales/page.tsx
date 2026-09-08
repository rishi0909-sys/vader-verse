"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function AdminSalesPage() {
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

  const salesData = analysis.merchSales;
  const totalRevenue = salesData.reduce((acc: number, curr: any) => acc + curr.revenue, 0);
  const totalSales = salesData.reduce((acc: number, curr: any) => acc + curr.sales, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <ShoppingCart className="text-pink-400 w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Sales & Merchandising</h1>
        </div>
        <p className="text-white/50">Printful API sync, revenue breakdowns, and order fulfillment statistics.</p>
      </header>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 blur-[40px] -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <DollarSign className="w-4 h-4 text-pink-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold text-white relative z-10">${totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-[40px] -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <Package className="w-4 h-4 text-orange-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">Items Sold</h3>
          </div>
          <p className="text-3xl font-bold text-white relative z-10">{totalSales.toLocaleString()}</p>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[40px] -mr-8 -mt-8 transition-opacity group-hover:opacity-100 opacity-50" />
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white/60 font-medium text-xs uppercase tracking-wider">AOV</h3>
          </div>
          <p className="text-3xl font-bold text-white relative z-10">${(totalRevenue / (totalSales || 1)).toFixed(2)}</p>
        </div>

        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-5 rounded-2xl flex flex-col justify-center">
           <div className="inline-flex items-center self-start px-2.5 py-1 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-400 text-xs font-semibold mb-2">
             Printful Sync Active
           </div>
           <p className="text-white/40 text-xs">Last sync: 2 mins ago</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white/90 mb-6">Revenue Over Time</h3>
          <ChartContainer config={{ revenue: { label: "Revenue ($)", color: "#ec4899" } }} className="h-[350px] w-full">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Volume Bar Chart */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold text-white/90 mb-6">Sales Volume</h3>
          <ChartContainer config={{ sales: { label: "Items Sold", color: "#f97316" } }} className="h-[350px] w-full">
            <BarChart data={salesData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Mocked Recent Orders Table */}
      <div className="bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white/90">Recent Printful Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="text-xs uppercase bg-white/5 border-b border-white/5 text-white/40">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">PF-8{Math.floor(Math.random() * 10000)}</td>
                  <td className="px-6 py-4">Sep {8 - i}, 2026</td>
                  <td className="px-6 py-4">Vader-Verse Heavyweight Hoodie</td>
                  <td className="px-6 py-4 font-semibold text-white/90">$85.00</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Fulfilled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
