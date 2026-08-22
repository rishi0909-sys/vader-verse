import { getFeaturedGames } from "@/services/rawgService";

export default async function ArcadePage() {
  const games = await getFeaturedGames();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Arcade</h1>
      
      {/* AI Recommendation Placeholder */}
      <section className="mb-16 rounded-2xl border border-red-900/30 bg-red-900/10 p-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span className="text-red-500">✨</span> Recommended for You
        </h2>
        <p className="text-zinc-400 mb-6">Because you played Elden Ring, you might like these titles.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-40 rounded-xl bg-zinc-800 animate-pulse" />
          <div className="h-40 rounded-xl bg-zinc-800 animate-pulse" />
        </div>
      </section>

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
  );
}
