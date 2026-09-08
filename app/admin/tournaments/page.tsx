"use client";

import { useEffect, useState } from "react";
import { Check, X, Calendar, User as UserIcon } from "lucide-react";

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  async function fetchTournaments() {
    try {
      const token = localStorage.getItem("vader_token");
      const res = await fetch("/api/admin/tournaments?status=pending_approval", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setTournaments(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(tournamentId: string, action: "approve" | "reject") {
    setProcessingId(tournamentId);
    try {
      const token = localStorage.getItem("vader_token");
      const res = await fetch("/api/admin/tournaments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tournamentId, action })
      });
      if (res.ok) {
        // Remove from list
        setTournaments(prev => prev.filter((t: any) => t._id !== tournamentId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white/90">Tournament Moderation</h1>
        <p className="text-white/50 mt-2">Review and approve user-submitted tournaments before they go public.</p>
      </header>

      {tournaments.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/50 text-lg">No tournaments pending approval.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tournaments.map((t: any) => (
            <div key={t._id} className="bg-black/40 border border-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors">
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{t.title}</h3>
                  <p className="text-white/50 text-sm line-clamp-2 max-w-2xl">{t.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg text-white/70">
                    <UserIcon size={14} />
                    <span>{t.createdBy?.username || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg text-white/70">
                    <Calendar size={14} />
                    <span>Start: {new Date(t.startDate).toLocaleDateString()}</span>
                  </div>
                  {t.game && (
                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg text-white/70">
                      <span className="text-white/40">Game:</span>
                      <span className="text-red-400">{t.game.title}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex md:flex-col gap-3 min-w-[120px]">
                <button
                  onClick={() => handleAction(t._id, "approve")}
                  disabled={processingId === t._id}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50 transition-all px-4 py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check size={16} />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleAction(t._id, "reject")}
                  disabled={processingId === t._id}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all px-4 py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <X size={16} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
