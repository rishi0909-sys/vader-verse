import { getGameMonetizeGames } from "@/services/gamemonetizeService";
import GameRecommendations from "@/components/GameRecommendations";
import ArcadeMasonry from "@/components/ArcadeMasonry";
import AuthGuard from "@/components/AuthGuard";
import ReadySignal from "@/components/loading/ReadySignal";
import { FaultyTerminal } from '@/components/Backgrounds';
import Link from "next/link";
import { MonetizeDemo } from "@/components/MonetizeDemo";
import { Puzzle, Swords, Car, Compass, Gamepad2, Trophy, Zap, User, Crosshair, Globe, Heart, Box } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  "Puzzle": Puzzle,
  "Action": Swords,
  "Racing": Car,
  "Adventure": Compass,
  "Arcade": Gamepad2,
  "Sports": Trophy,
  "Hypercasual": Zap,
  "Stickman": User,
  "Shooting": Crosshair,
  ".IO": Globe,
  "Girls": Heart,
  "3D": Box
};

export default async function ArcadePage({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const { genre } = await searchParams;
  const games = await getGameMonetizeGames(60, genre);
  
  const POPULAR_PORTALS = [
    "Puzzle", "Action", "Racing", "Adventure", "Arcade", "Sports", 
    "Hypercasual", "Stickman", "Shooting", ".IO", "Girls", "3D"
  ];

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
        <MonetizeDemo />
        
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

        {/* CHAPTER 04: DEEPER CONTENT (Genres) - MOVED TO TOP */}
        <section className="container mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 fill-mode-both">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white/60 uppercase tracking-widest">Explore Portals</h2>
            <div className="h-px bg-white/5 flex-1 ml-6" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {POPULAR_PORTALS.map(g => {
              const Icon = ICONS[g] || Gamepad2;
              return (
              <Link key={g} href={`/arcade?genre=${g.toLowerCase()}`}>
                <div className={`aspect-square bg-black/40 border ${genre?.toLowerCase() === g.toLowerCase() ? 'border-red-500/50 bg-red-900/20 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-white/5'} backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-red-900/20 hover:border-red-500/50 transition-all duration-500 cursor-pointer shadow-lg group`}>
                  <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center border transition-colors duration-500 ${genre?.toLowerCase() === g.toLowerCase() ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-white/40 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:text-red-400'}`}>
                    <Icon className="w-5 h-5 transition-colors" />
                  </div>
                  <span className={`font-bold tracking-wide ${genre?.toLowerCase() === g.toLowerCase() ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{g}</span>
                </div>
              </Link>
              );
            })}
          </div>
        </section>

        {/* CHAPTER 02 & 03: DYNAMIC SWAP BASED ON GENRE */}
        {genre ? (
          <>
            {/* Masonry First */}
            <section className="container mx-auto px-4 mb-32 relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
              <div className="absolute inset-0 bg-red-900/5 blur-[100px] pointer-events-none -z-10" />
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-white/90">
                  Public Games: {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </h2>
                <div className="h-px bg-white/10 flex-1 ml-6" />
              </div>
              <ArcadeMasonry games={games} />
            </section>
            
            {/* Communities Second */}
            <section className="container mx-auto px-4 mb-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white/90">Communities Based Upon Your Interests</h2>
                <div className="h-px bg-white/10 flex-1 ml-6" />
              </div>
              <GameRecommendations />
            </section>
          </>
        ) : (
          <>
            {/* Communities First */}
            <section className="container mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white/90">Communities Based Upon Your Interests</h2>
                <div className="h-px bg-white/10 flex-1 ml-6" />
              </div>
              <GameRecommendations />
            </section>

            {/* Masonry Second */}
            <section className="container mx-auto px-4 mb-32 relative">
              <div className="absolute inset-0 bg-red-900/5 blur-[100px] pointer-events-none -z-10" />
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-white/90">Public Games</h2>
                <div className="h-px bg-white/10 flex-1 ml-6" />
              </div>
              <ArcadeMasonry games={games} />
            </section>
          </>
        )}


      </div>
    </AuthGuard>
  );
}
