export default function TournamentsLoading() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black" />
      
      {/* Contrast/Readability Layer */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
      
      <div className="relative z-10 min-h-screen flex flex-col pt-32 px-4 container mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8 opacity-50">
          <div className="h-10 w-64 bg-purple-500/20 animate-pulse rounded-lg border border-purple-500/30" />
          <div className="h-px bg-white/10 flex-1 ml-6" />
        </div>

        {/* Primary Card Skeleton */}
        <div className="w-full h-64 md:h-80 bg-black/40 border border-purple-500/20 rounded-3xl mb-12 flex flex-col md:flex-row p-8 gap-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 to-transparent" />
          <div className="w-full md:w-2/5 h-full bg-purple-500/10 animate-pulse rounded-2xl shrink-0" />
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="h-8 w-3/4 bg-white/10 animate-pulse rounded-md" />
            <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded-md" />
            <div className="h-4 w-2/3 bg-white/5 animate-pulse rounded-md" />
            <div className="mt-8 flex gap-4">
              <div className="h-6 w-24 bg-white/10 animate-pulse rounded-md" />
              <div className="h-6 w-24 bg-white/10 animate-pulse rounded-md" />
            </div>
          </div>
        </div>

        {/* Secondary Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 border border-white/5 bg-black/40 rounded-2xl p-6 flex flex-col relative overflow-hidden">
              <div className="w-full h-32 bg-white/5 animate-pulse rounded-xl mb-6" />
              <div className="h-6 w-2/3 bg-white/10 animate-pulse rounded-md mb-4" />
              <div className="h-4 w-full bg-white/5 animate-pulse rounded-md mb-2" />
              <div className="h-4 w-1/2 bg-white/5 animate-pulse rounded-md" />
              <div className="mt-auto flex justify-between border-t border-white/5 pt-4">
                <div className="h-4 w-16 bg-white/5 animate-pulse rounded-md" />
                <div className="h-4 w-16 bg-white/5 animate-pulse rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
