import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CommunityLoading() {
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans animate-pulse">
      
      {/* Header Skeleton */}
      <header className="h-16 flex-none border-b border-zinc-800/50 bg-zinc-950/80 flex items-center px-4 md:px-6 relative">
        <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium opacity-50">
          <ArrowLeft size={16} />
          <span>Vader-Verse</span>
        </Link>
        <div className="mx-4 h-6 w-px bg-zinc-800" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-800 rounded" />
            <div className="h-2 w-16 bg-zinc-800/50 rounded" />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-900/10 blur-[100px] rounded-full" />
        </div>

        {/* Sidebar Skeleton */}
        <aside className="w-64 flex-none border-r border-zinc-800/50 bg-zinc-950/40 z-10 flex flex-col hidden md:flex">
          <div className="p-4">
            <div className="h-3 w-20 bg-zinc-800 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2">
                  <div className="w-4 h-4 bg-zinc-800 rounded" />
                  <div className="h-3 w-24 bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div className="space-y-1">
                <div className="h-3 w-24 bg-zinc-800 rounded" />
                <div className="h-2 w-16 bg-zinc-800/50 rounded" />
              </div>
            </div>
          </div>
        </aside>

        {/* Chat Area Skeleton */}
        <main className="flex-1 flex flex-col min-w-0 bg-black/40 z-10 relative">
          
          {/* Channel Header Skeleton */}
          <div className="h-14 border-b border-zinc-800/30 flex items-center px-6 gap-2 flex-none bg-zinc-950/30">
            <div className="w-5 h-5 bg-zinc-800 rounded" />
            <div className="h-4 w-32 bg-zinc-800 rounded" />
          </div>

          {/* Messages Feed Skeleton */}
          <div className="flex-1 overflow-hidden p-4 md:p-6 flex flex-col gap-6 justify-end">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 px-2">
                <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-24 bg-zinc-800 rounded" />
                    <div className="h-2 w-12 bg-zinc-800/50 rounded" />
                  </div>
                  <div className="space-y-1.5">
                    <div className={`h-3 bg-zinc-800/80 rounded ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
                    {i % 2 !== 0 && <div className="h-3 w-2/3 bg-zinc-800/80 rounded" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area Skeleton */}
          <div className="p-4 md:p-6 flex-none">
            <div className="w-full h-12 bg-zinc-900/80 border border-zinc-800 rounded-xl" />
          </div>

        </main>
      </div>
    </div>
  );
}
