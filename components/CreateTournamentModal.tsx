"use client";

import { useState, useEffect, useRef } from "react";
import { Trophy, Calendar, Users, X, Crown, Loader2, Search, Crosshair } from "lucide-react";

export default function CreateTournamentModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("16");
  const [bracketType, setBracketType] = useState("Single Elimination");
  const [rules, setRules] = useState("");

  // Game Search State
  const [gameQuery, setGameQuery] = useState("");
  const [gameResults, setGameResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchActiveCount();
    } else {
      // Reset state on close
      setRequiresUpgrade(false);
      setError(null);
      setSelectedGame(null);
      setGameQuery("");
      setGameResults([]);
    }
  }, [isOpen]);

  const fetchActiveCount = async () => {
    try {
      const token = localStorage.getItem("vader_token");
      if (!token) return;
      const res = await fetch("/api/tournaments/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActiveCount(data.activeCount);
        if (data.activeCount >= 1) {
          setRequiresUpgrade(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchGame = (query: string) => {
    setGameQuery(query);
    if (!query) {
      setGameResults([]);
      return;
    }
    
    setSearching(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/rawg/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success && data.games) {
          setGameResults(data.games);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCount && activeCount >= 1) {
      setRequiresUpgrade(true);
      return;
    }

    if (!selectedGame) {
      setError("Please select a game from the search results.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("vader_token");
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          rawgGame: selectedGame,
          startDate,
          endDate,
          maxParticipants: parseInt(maxParticipants),
          bracketType,
          rules
        })
      });
      const data = await res.json();
      
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message);
        if (data.requiresUpgrade) {
          setRequiresUpgrade(true);
        }
      }
    } catch (err) {
      setError("Something went wrong creating the tournament.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-purple-500/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] animate-in zoom-in-95 duration-300 relative my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Create Tournament</h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {requiresUpgrade ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)] mb-8">
              <Crown className="w-12 h-12 text-black" />
            </div>
            <h3 className="text-4xl font-black text-white mb-4">Premium Feature</h3>
            <p className="text-lg text-white/60 mb-8 max-w-md">
              You already have an active tournament running. Upgrade to <strong className="text-yellow-500">Vader Pro</strong> to host multiple tournaments simultaneously and unlock custom brackets.
            </p>
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black py-4 px-12 rounded-full text-lg shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-105 transition-transform duration-300">
              Upgrade to Pro ($4.99/mo)
            </button>
            <button onClick={onClose} className="mt-6 text-white/40 hover:text-white font-semibold">
              Cancel
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
            
            {error && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Tournament Title</label>
                  <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-purple-500 outline-none transition-colors" placeholder="e.g. Winter Clash 2026" />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-bold text-white/70 mb-2">Game (Multiplayer)</label>
                  {selectedGame ? (
                    <div className="flex items-center gap-3 bg-purple-900/20 border border-purple-500/50 p-2 rounded-xl">
                      <div className="w-12 h-12 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${selectedGame.background_image})`}} />
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm line-clamp-1">{selectedGame.name}</div>
                        <div className="text-purple-400 text-xs">Selected</div>
                      </div>
                      <button type="button" onClick={() => setSelectedGame(null)} className="p-2 text-white/40 hover:text-red-400"><X className="w-4 h-4"/></button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <input type="text" value={gameQuery} onChange={(e) => handleSearchGame(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-white placeholder-white/20 focus:border-purple-500 outline-none transition-colors" placeholder="Search RAWG database..." />
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                        {searching && <Loader2 className="w-4 h-4 text-purple-400 animate-spin absolute right-3.5 top-3.5" />}
                      </div>
                      
                      {gameResults.length > 0 && !selectedGame && (
                        <div className="absolute z-20 w-full mt-2 bg-zinc-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                          {gameResults.map((game) => (
                            <button
                              key={game.id}
                              type="button"
                              onClick={() => { setSelectedGame(game); setGameQuery(""); setGameResults([]); }}
                              className="w-full flex items-center gap-3 p-3 hover:bg-purple-500/20 border-b border-white/5 transition-colors text-left"
                            >
                              <div className="w-10 h-10 bg-cover bg-center rounded-md shrink-0" style={{ backgroundImage: `url(${game.background_image})`}} />
                              <span className="text-white font-semibold text-sm line-clamp-1">{game.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white/70 mb-2">Start Date</label>
                    <input required type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white/70 mb-2">End Date (Optional)</label>
                    <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white/70 mb-2">Max Players</label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
                      <input type="number" required min="2" max="1024" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-white focus:border-purple-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white/70 mb-2">Bracket Type</label>
                    <div className="relative">
                      <Crosshair className="w-4 h-4 text-white/40 absolute left-3 top-3.5" />
                      <select value={bracketType} onChange={(e) => setBracketType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-white focus:border-purple-500 outline-none appearance-none">
                        <option value="Single Elimination">Single Elimination</option>
                        <option value="Double Elimination">Double Elimination</option>
                        <option value="Round Robin">Round Robin</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Description</label>
                  <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-purple-500 outline-none resize-none" placeholder="Briefly describe the event..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Ruleset</label>
                  <textarea rows={2} value={rules} onChange={(e) => setRules(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:border-purple-500 outline-none resize-none" placeholder="Any specific rules or restrictions..." />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-white/40">Active Quota:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-black ${activeCount === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {activeCount !== null ? activeCount : '-'}/1
                </span>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-6 py-3 font-semibold text-white/50 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] flex items-center gap-2 disabled:opacity-50">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Deploy Tournament
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
