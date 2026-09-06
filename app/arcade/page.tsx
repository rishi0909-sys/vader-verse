import { getFeaturedGames } from "@/services/rawgService";
import GameRecommendations from "@/components/GameRecommendations";
import FeaturedGameCard from "@/components/FeaturedGameCard";
import AuthGuard from "@/components/AuthGuard";
import ReadySignal from "@/components/loading/ReadySignal";
import { FaultyTerminal } from '@/components/Backgrounds';
import Link from "next/link";

export default async function ArcadePage() {
  const games = await getFeaturedGames();

  return (
    <AuthGuard>
      {/* Background Layer z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FaultyTerminal 
          tint="#dc2626"
          glitchAmount={0.3}
          flickerAmount={0.2}
          curvature={0.15}
          scanlineIntensity={0.8}
        />
      </div>
      
      {/* Contrast/Readability Layer z-1 */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
      
      {/* Existing Content z-10 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <ReadySignal />
        
        {/* CHAPTER 01: OPENING */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <div className="inline-block mb-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 font-bold tracking-widest text-xs uppercase shadow-[0_0_15px_rgba(220,38,38,0.1)] backdrop-blur-md">
            World 01
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.3)] tracking-tighter uppercase italic">
            Enter the Arcade
          </h1>
          <p className="text-xl text-white/50 max-w-2xl font-medium">
            Immerse yourself in new worlds, hand-picked for your playstyle.
          </p>
        </section>

        {/* CHAPTER 02: PRIMARY EXPERIENCE (Personalized) */}
        <section className="container mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white/90">Curated For You</h2>
            <div className="h-px bg-white/10 flex-1 ml-6" />
          </div>
          <GameRecommendations />
        </section>

        {/* CHAPTER 03: SECONDARY DISCOVERY (Featured) */}
        <section className="container mx-auto px-4 mb-32 relative">
          <div className="absolute inset-0 bg-red-900/5 blur-[100px] pointer-events-none -z-10" />
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white/90">Global Highlights</h2>
            <div className="h-px bg-white/10 flex-1 ml-6" />
          </div>
          <div className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory scrollbar-hide">
            {games && games.length > 0 ? (
              games.map((game: any, i: number) => (
                <div key={game.id} className="snap-center sm:snap-start shrink-0">
                  <FeaturedGameCard game={game} />
                </div>
              ))
            ) : (
              <p className="text-zinc-400">Loading games...</p>
            )}
          </div>
        </section>

        {/* CHAPTER 04: DEEPER CONTENT (Genres) */}
        <section className="container mx-auto px-4 mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white/60 uppercase tracking-widest">Explore Portals</h2>
            <div className="h-px bg-white/5 flex-1 ml-6" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {["Action", "RPG", "Strategy", "Shooter", "Adventure", "Indie"].map(genre => (
              <Link key={genre} href={`/arcade?genre=${genre.toLowerCase()}`}>
                <div className="aspect-square bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-red-900/20 hover:border-red-500/50 transition-all duration-500 cursor-pointer shadow-lg group">
                  <div className="w-12 h-12 bg-white/5 rounded-full mb-4 flex items-center justify-center border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/40 transition-colors duration-500">
                    <span className="text-white/40 group-hover:text-red-400 transition-colors">✧</span>
                  </div>
                  <span className="font-bold text-white/70 group-hover:text-white tracking-wide">{genre}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
