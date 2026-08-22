import { Trophy, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function TournamentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Tournaments</h1>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
          Create Tournament
        </button>
      </div>

      {/* AI Assistant Placeholder */}
      <section className="mb-12 rounded-2xl border border-blue-900/30 bg-blue-900/10 p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0">
          🤖
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-400 mb-1">Tournament Assistant</h3>
          <p className="text-sm text-zinc-400 mb-3">Ask me about your upcoming matches, bracket status, or tournament rules.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="When is my next match?" 
              className="bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-sm w-full max-w-md focus:outline-none focus:border-blue-500"
              disabled
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" disabled>
              Ask
            </button>
          </div>
        </div>
      </section>

      {/* Tournaments List Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3 h-32 bg-zinc-800 rounded-lg shrink-0" />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">Weekly CS:GO Scrimmage {i}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-green-900/30 text-green-400 rounded-full">Registration Open</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">Join the weekly competitive scrimmage. Open to all skill levels. Prizes for top 3 teams.</p>
              <div className="mt-auto flex flex-wrap gap-4 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Oct 24, 2026</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 12/32 Teams</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
