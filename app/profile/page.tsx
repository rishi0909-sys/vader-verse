"use client";

import { useEffect, useState } from "react";
import { User, Shield, Gamepad2, Award } from "lucide-react";
import { ApiClient } from "@/lib/apiClient";
import AuthGuard from "@/components/AuthGuard";
import ReadySignal from "@/components/loading/ReadySignal";

export default function ProfilePage() {
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get("/api/preferences")
      .then((res) => {
        setPreferences(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <AuthGuard>
      {!loading && <ReadySignal />}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-red-900 to-black" />
          <div className="px-8 pb-8 relative">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 -mt-12 mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-zinc-500" />
            </div>
            <h1 className="text-3xl font-bold mb-1">Your Profile</h1>
            <p className="text-zinc-400 mb-4">View your personalized AI data</p>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full">
                <Shield className="w-3 h-3" /> Player
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-red-500" /> Favorite Genres
            </h2>
            {loading ? (
              <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded-full" />
            ) : preferences?.topGenres?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {preferences.topGenres.map((genre: string) => (
                  <span key={genre} className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-500/20 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic">No genres identified yet.</p>
            )}
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" /> Most Played Games
            </h2>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-32 bg-zinc-800 animate-pulse rounded" />
                <div className="h-4 w-40 bg-zinc-800 animate-pulse rounded" />
              </div>
            ) : preferences?.favoriteGames?.length > 0 ? (
              <div className="flex flex-col gap-3">
                {preferences.favoriteGames.map((game: string) => (
                  <div key={game} className="flex items-center gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                      🕹️
                    </div>
                    <span className="text-sm font-medium text-zinc-200">{game}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic">No favorite games identified yet. Keep playing!</p>
            )}
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}
