"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Check, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

// Static curated list for quick onboarding without requiring a heavy DB lookup
const ONBOARDING_GAMES = [
  { id: "Elden Ring", title: "Elden Ring", genres: ["RPG", "Action"] },
  { id: "Grand Theft Auto V", title: "Grand Theft Auto V", genres: ["Action", "Adventure"] },
  { id: "Minecraft", title: "Minecraft", genres: ["Adventure", "Simulation"] },
  { id: "Valorant", title: "Valorant", genres: ["Shooter", "Action"] },
  { id: "Cyberpunk 2077", title: "Cyberpunk 2077", genres: ["RPG", "Action"] },
  { id: "EA SPORTS FC 24", title: "EA SPORTS FC 24", genres: ["Sports", "Simulation"] },
  { id: "Baldur's Gate 3", title: "Baldur's Gate 3", genres: ["RPG", "Strategy"] },
  { id: "Call of Duty: Warzone", title: "Call of Duty: Warzone", genres: ["Shooter", "Action"] }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleGame = (id: string) => {
    setSelectedGames(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (selectedGames.length === 0) {
      router.push("/arcade"); // Skip if they didn't select anything
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("vader_token");
      await axios.post(
        "/api/onboarding",
        { gameIds: selectedGames },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Successfully injected initial evidence, route to their new bubble
      router.push("/arcade");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save preferences.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-zinc-950 to-zinc-950 -z-10" />
      
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 text-red-500 mb-6 border border-red-500/20">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">What games are you into?</h1>
          <p className="text-xl text-zinc-400">
            Select a few games you enjoy. We'll use this to build your initial personalized bubble.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-950/50 border border-red-900 rounded-lg text-center text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {ONBOARDING_GAMES.map(game => {
            const isSelected = selectedGames.includes(game.id);
            return (
              <button
                key={game.id}
                onClick={() => toggleGame(game.id)}
                className={`
                  relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 text-center
                  ${isSelected 
                    ? "bg-red-900/20 border-red-500 ring-2 ring-red-500/20" 
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"}
                `}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
                <h3 className={`font-bold mb-2 ${isSelected ? "text-white" : "text-zinc-200"}`}>
                  {game.title}
                </h3>
                <p className="text-xs text-zinc-500">{game.genres.join(", ")}</p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleComplete}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-full bg-red-600 px-12 py-4 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50 text-lg shadow-xl shadow-red-900/20"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Preparing your feed...</>
            ) : selectedGames.length > 0 ? (
              <>Continue <ArrowRight className="w-5 h-5" /></>
            ) : (
              <>Skip for now <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
