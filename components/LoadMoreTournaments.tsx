"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import Image from "next/image";

export default function LoadMoreTournaments({ initialCursor, hasMoreInitial }: { initialCursor: string | null, hasMoreInitial: boolean }) {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [cursor, setCursor] = useState(initialCursor);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!cursor || loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tournaments?cursor=${encodeURIComponent(cursor)}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTournaments([...tournaments, ...data.tournaments]);
          setCursor(data.nextCursor);
          setHasMore(data.hasMore);
        }
      }
    } catch (error) {
      console.error("Failed to load more tournaments", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMore && tournaments.length === 0) return null;

  return (
    <div className="w-full mt-12 flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto mb-12">
        {tournaments.map((t, idx) => (
          <div key={t._id || idx} className="rounded-xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-sm p-4 relative group hover:border-red-500/50 transition-colors">
            {t.game && t.game.coverImage && (
              <div className="w-full h-40 relative rounded-lg overflow-hidden mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Image src={t.game.coverImage} alt={t.game.title} fill className="object-cover" />
              </div>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
            <p className="text-sm text-zinc-400 mb-4">{new Date(t.startDate).toLocaleDateString()}</p>
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1"><Trophy className="w-3 h-3"/> {t.bracketType}</span>
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button 
          onClick={loadMore} 
          disabled={loading}
          className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold tracking-widest text-sm rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
