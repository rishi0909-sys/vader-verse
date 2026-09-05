import { Trophy, Users, Calendar } from "lucide-react";
import Link from "next/link";
import TournamentRecommendations from "@/components/TournamentRecommendations";
import AuthGuard from "@/components/AuthGuard";
import ReadySignal from "@/components/loading/ReadySignal";

export default function TournamentsPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <ReadySignal />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">Tournaments</h1>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
            Create Tournament
          </button>
        </div>

        <TournamentRecommendations />

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
    </AuthGuard>
  );
}
