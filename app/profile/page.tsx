"use client";

import { useEffect, useState } from "react";
import { User, Shield, Gamepad2, Award } from "lucide-react";
import { ApiClient } from "@/lib/apiClient";
import AuthGuard from "@/components/AuthGuard";
import ReadySignal from "@/components/loading/ReadySignal";
import { Silk } from '@/components/Backgrounds';
import TextType from "@/components/TextType";

export default function ProfilePage() {
  const [preferences, setPreferences] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get("/api/preferences")
      .then((res) => {
        setPreferences(res.data);
        setUserData(res.user);
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
      {/* Background Layer z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Silk 
          color="#7F1D1D"
          speed={0.8}
        />
      </div>
      
      {/* Contrast/Readability Layer z-1 */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
      
      {/* Existing Content z-10 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {!loading && <ReadySignal />}
        
        {/* CHAPTER 01: OPENING */}
        <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 animate-in fade-in zoom-in-95 duration-1000 ease-out">
          <div className="w-32 h-32 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] relative group">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <User className="w-12 h-12 text-white/70 group-hover:text-white transition-colors duration-500 relative z-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] min-h-[1.2em] flex items-center justify-center gap-3 md:gap-4 flex-wrap">
            <span>Welcome Back</span>
            {userData?.username && (
              <TextType 
                text={userData.username} 
                initialDelay={500} 
                loop={false}
                cursorBlinkDuration={0.8}
                className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              />
            )}
          </h1>
          <div className="flex gap-4 items-center justify-center mt-6">
            <span className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-white/5 border border-white/10 text-white/80 rounded-full shadow-lg backdrop-blur-md">
              <Shield className="w-4 h-4 text-red-400" /> Player Identity Active
            </span>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pb-32 flex flex-col gap-24">
          
          {/* CHAPTER 02: YOUR IDENTITY (Genres) */}
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-900/5 blur-[100px] pointer-events-none -z-10" />
            <div className="text-center mb-10">
              <Gamepad2 className="w-8 h-8 text-red-500/50 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white/90 tracking-tight">Your Frequency</h2>
              <p className="text-white/40 mt-2 font-medium">The genres that define your path in the Vader-Verse.</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-10 hover:bg-black/30 hover:border-white/10 transition-all duration-700 shadow-2xl text-center">
              {loading ? (
                <div className="flex justify-center gap-3">
                  <div className="h-10 w-24 bg-white/5 animate-pulse rounded-full" />
                  <div className="h-10 w-32 bg-white/5 animate-pulse rounded-full delay-75" />
                </div>
              ) : preferences?.topGenres?.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {preferences.topGenres.map((genre: string) => (
                    <span key={genre} className="px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full font-bold tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:bg-red-500/20 hover:scale-105 transition-all cursor-default">
                      {genre}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 italic">No genres identified yet. Keep exploring.</p>
              )}
            </div>
          </section>

          {/* CHAPTER 03: YOUR WORLD (Games) */}
          <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
            <div className="text-center mb-10">
              <Award className="w-8 h-8 text-yellow-500/50 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white/90 tracking-tight">Your Dominions</h2>
              <p className="text-white/40 mt-2 font-medium">The worlds you spend the most time conquering.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {loading ? (
                <>
                  <div className="h-24 bg-white/5 animate-pulse rounded-3xl" />
                  <div className="h-24 bg-white/5 animate-pulse rounded-3xl delay-100" />
                </>
              ) : preferences?.favoriteGames?.length > 0 ? (
                preferences.favoriteGames.map((game: string) => (
                  <div key={game} className="flex items-center gap-6 bg-black/40 p-6 rounded-3xl border border-white/5 hover:bg-black/60 hover:border-white/15 transition-all duration-500 shadow-xl group cursor-pointer hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-white/10 transition-colors">
                      <span className="text-2xl drop-shadow-md">🎮</span>
                    </div>
                    <span className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">{game}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center bg-black/20 border border-white/5 rounded-[2rem] p-10">
                  <p className="text-white/40 italic">No favorite games identified yet. Your journey is just beginning.</p>
                </div>
              )}
            </div>
          </section>
          
        </div>
      </div>
    </AuthGuard>
  );
}
