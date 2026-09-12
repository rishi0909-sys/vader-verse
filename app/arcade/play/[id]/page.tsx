import { getGameMonetizeGames } from "@/services/gamemonetizeService";
import AuthGuard from "@/components/AuthGuard";
import { GamePlayer } from "@/components/GamePlayer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

export default async function PlayGamePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // Ideally, we'd fetch the specific game by ID, but since GameMonetize uses a feed,
  // we'll fetch the feed and find the game to ensure we have the correct URL.
  // In production, you might want to cache this or store it in your DB.
  const games = await getGameMonetizeGames(100);
  const game = games.find((g) => g.id === id);

  if (!game) {
    notFound();
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black flex flex-col pt-16">
        {/* Header Bar */}
        <div className="h-16 border-b border-white/10 bg-zinc-950 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Link 
              href="/arcade" 
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg text-white/90 truncate max-w-sm">
              {game.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="text-xs uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-3 py-1 bg-white/5 backdrop-blur-sm hidden sm:inline-block">
               {game.category}
             </span>
          </div>
        </div>
        
        {/* Ad Disclaimer */}
        <div className="bg-zinc-900/50 border-b border-white/5 px-6 py-2 flex items-center justify-center gap-2 shrink-0">
          <Info className="w-4 h-4 text-zinc-400 shrink-0" />
          <p className="text-xs text-zinc-400 font-medium text-center">
            External Game: This game is provided by a 3rd party and may contain unskippable ads.
          </p>
        </div>

        {/* Game Player Canvas area */}
        <div className="w-full aspect-square md:aspect-video lg:aspect-[21/9] relative min-h-[300px] shrink-0">
          <GamePlayer gameUrl={game.url} />
        </div>
        
        {/* Details Section */}
        <div className="bg-zinc-950 p-6 md:p-8 shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
             <div className="flex-1 space-y-4">
                <h2 className="text-xl font-bold text-white/90">About this game</h2>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {game.description.replace(/<[^>]*>?/gm, '')}
                </p>
             </div>
             
             {game.instructions && (
               <div className="w-full md:w-1/3 space-y-4 bg-white/5 border border-white/5 rounded-xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">How to Play</h3>
                  <p className="text-zinc-400 text-sm">
                    {game.instructions.replace(/<[^>]*>?/gm, '')}
                  </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
