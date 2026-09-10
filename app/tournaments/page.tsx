import { Trophy, Users, Calendar } from "lucide-react";
import Link from "next/link";
import TournamentRecommendations from "@/components/TournamentRecommendations";
import ReadySignal from "@/components/loading/ReadySignal";
import { GridScan } from '@/components/Backgrounds';
import TournamentHeaderActions from "@/components/TournamentHeaderActions";
import LoadMoreTournaments from "@/components/LoadMoreTournaments";
import dbConnect from "@/lib/mongodb";
import Tournament from "@/models/Tournament";
import "@/models/Game";
import "@/models/User";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function TournamentsPage() {
  await dbConnect();
  
  const limit = 20;
  const tournaments = await Tournament.find({
    status: { $in: ["upcoming", "registration_open", "ongoing"] }
  })
    .populate("game")
    .sort({ startDate: 1, _id: 1 })
    .limit(limit + 1)
    .lean();

  const hasMore = tournaments.length > limit;
  if (hasMore) {
    tournaments.pop();
  }

  let nextCursor = null;
  if (hasMore && tournaments.length > 0) {
    const lastItem = tournaments[tournaments.length - 1] as any;
    const dateStr = lastItem.startDate.toISOString();
    const idStr = lastItem._id.toString();
    nextCursor = Buffer.from(`${dateStr}|${idStr}`).toString('base64');
  }

  const primaryTournament = tournaments.length > 0 ? tournaments[0] : null;
  const secondaryTournaments = tournaments.length > 1 ? tournaments.slice(1) : [];

  return (
    <main className="relative w-full min-h-screen">
      {/* Background Layer z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <GridScan 
          enableWebcam={false}
          showPreview={false}
          scanColor="#DC2626"
          linesColor="#991B1B"
        />
      </div>
      
      {/* Contrast/Readability Layer z-1 */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
      
      {/* Existing Content z-10 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <ReadySignal />
        
        {/* CHAPTER 01: OPENING */}
        <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 font-bold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <Trophy className="w-4 h-4" /> Competitive Arena
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] tracking-tighter uppercase italic">
            Choose Your Battlefield
          </h1>
          <TournamentHeaderActions />
        </section>

        {/* CHAPTER 02: PRIMARY EXPERIENCE */}
        <section className="container mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white/90">Your Active Fronts</h2>
            <div className="h-px bg-white/10 flex-1 ml-6" />
          </div>
          <TournamentRecommendations />
        </section>

        {/* CHAPTER 03: SECONDARY DISCOVERY */}
        <section className="container mx-auto px-4 mb-32 relative">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white/90">Global Scrimmages</h2>
            <div className="h-px bg-white/10 flex-1 ml-6" />
          </div>

          <div className="flex flex-col gap-6">
            {/* Major Featured Scrimmage */}
            {primaryTournament ? (
              <div className="w-full border border-purple-500/30 bg-black/60 rounded-3xl p-8 flex flex-col md:flex-row gap-8 transition-all duration-500 hover:bg-black/70 hover:border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.1)] cursor-pointer group">
                <div className="w-full md:w-2/5 h-48 md:h-full min-h-[200px] bg-purple-900/20 border border-purple-500/20 rounded-2xl shrink-0 overflow-hidden relative flex items-center justify-center">
                  <Image 
                    src={(primaryTournament.game as any)?.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'}
                    alt={primaryTournament.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/50 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500 mix-blend-overlay z-10" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-black text-3xl text-white group-hover:text-red-100 transition-colors tracking-tight">{primaryTournament.title}</h3>
                    {new Date(primaryTournament.startDate).getTime() < Date.now() ? (
                      <span className="text-xs uppercase tracking-widest font-black px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.2)] backdrop-blur-md whitespace-nowrap ml-4 animate-pulse">Live Now</span>
                    ) : (
                      <span className="text-xs uppercase tracking-widest font-black px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.2)] backdrop-blur-md whitespace-nowrap ml-4">
                        Starts in {Math.ceil((new Date(primaryTournament.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-white/60 mb-6 font-medium leading-relaxed">{primaryTournament.description || "Join the scrimmage and battle for dominance."}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-white/50 font-bold mt-auto">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-red-400" /> {new Date(primaryTournament.startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 text-red-400" /> {(primaryTournament.participants as any[])?.length || 0}/{primaryTournament.maxParticipants || "∞"} Players</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center border border-white/10 rounded-3xl bg-white/5">
                <p className="text-white/50">No active tournaments right now. Be the first to create one!</p>
              </div>
            )}

            {/* Supporting Grid */}
            {secondaryTournaments.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {secondaryTournaments.map((t: any, i) => {
                  const fallbacks = [
                    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop',
                  ];
                  const imgUrl = (t.game as any)?.coverImage || fallbacks[i % fallbacks.length];
                  
                  return (
                    <div key={t._id.toString()} className="border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col transition-all duration-500 hover:bg-black/60 hover:border-white/20 hover:-translate-y-1 shadow-lg cursor-pointer group">
                      <div className="w-full h-32 bg-white/5 border border-white/5 rounded-xl mb-6 overflow-hidden relative">
                        <Image 
                          src={imgUrl}
                          alt={t.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <h3 className="font-bold text-lg text-white/90 group-hover:text-white transition-colors leading-tight line-clamp-1">{t.title}</h3>
                          {new Date(t.startDate).getTime() < Date.now() ? (
                            <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full whitespace-nowrap animate-pulse">Live</span>
                          ) : (
                            <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full whitespace-nowrap">Open</span>
                          )}
                        </div>
                        <p className="text-sm text-white/50 mb-6 line-clamp-2 font-medium">{t.description || "Open to all skill levels."}</p>
                        <div className="mt-auto flex justify-between text-xs text-white/40 font-semibold border-t border-white/5 pt-4">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(t.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {(t.participants as any[])?.length || 0}/{t.maxParticipants || "∞"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <LoadMoreTournaments initialCursor={nextCursor} hasMoreInitial={hasMore} />
          </div>
        </section>
      </div>
    </main>
  );
}
