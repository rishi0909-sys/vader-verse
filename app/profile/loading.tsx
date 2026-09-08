import { Trophy, History, Shield, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import { GridScan } from '@/components/Backgrounds';

export default function ProfileLoading() {
  return (
    <main className="relative w-full min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0 bg-black" />
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
      
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-24 min-h-screen flex flex-col gap-12">
        {/* Profile Header Skeleton */}
        <section className="bg-black/60 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 backdrop-blur-md opacity-50">
          <div className="w-32 h-32 rounded-full bg-purple-500/20 animate-pulse border-4 border-purple-500/30" />
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div className="h-10 w-48 bg-white/10 animate-pulse rounded-md mx-auto md:mx-0" />
            <div className="h-6 w-32 bg-white/5 animate-pulse rounded-full mx-auto md:mx-0" />
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4 border-t border-white/5 mt-4">
              <div className="h-16 w-32 bg-white/5 animate-pulse rounded-xl" />
              <div className="h-16 w-32 bg-white/5 animate-pulse rounded-xl" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-50">
          {/* Trophy Cabinet Skeleton */}
          <section className="lg:col-span-1 bg-black/40 border border-yellow-500/10 rounded-3xl p-8 flex flex-col gap-6">
            <div className="h-8 w-48 bg-yellow-500/20 animate-pulse rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-yellow-500/5 border border-yellow-500/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          </section>

          {/* Match History Skeleton */}
          <section className="lg:col-span-2 bg-black/40 border border-white/5 rounded-3xl p-8 flex flex-col gap-6">
            <div className="h-8 w-48 bg-white/10 animate-pulse rounded-md" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
