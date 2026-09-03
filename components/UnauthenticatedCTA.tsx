"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function UnauthenticatedCTA() {
  return (
    <section className="mb-16 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <Sparkles className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Discover Your Next Obsession</h2>
      <p className="text-zinc-400 max-w-lg mb-8">
        Vader-Verse learns what you play to bring you a personalized bubble of games, news, and tournaments you'll love.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/register" 
          className="rounded-xl bg-red-600 px-8 py-3 font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
        >
          Create Profile
        </Link>
        <Link 
          href="/login" 
          className="rounded-xl bg-zinc-800 px-8 py-3 font-bold text-white hover:bg-zinc-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
