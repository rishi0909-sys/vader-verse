import { getFeaturedGames } from "@/services/rawgService";
import GameRecommendations from "@/components/GameRecommendations";
import AuthGuard from "@/components/AuthGuard";
import ReadySignal from "@/components/loading/ReadySignal";

export default async function ArcadePage() {
  const games = await getFeaturedGames();

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-12">
        <ReadySignal />
        <h1 className="text-4xl font-bold mb-8">Arcade</h1>
        
        <GameRecommendations />

        {/* Featured Games */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games && games.length > 0 ? (
              games.map((game: any) => (
                <div key={game.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                  <div 
                    className="h-48 bg-zinc-800 bg-cover bg-center"
                    style={{ backgroundImage: `url(${game.background_image})` }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold truncate">{game.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1">Rating: {game.rating}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-400">Loading games...</p>
            )}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
