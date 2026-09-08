import { getGamingNews } from "@/services/newsService";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import NewsRecommendations from "@/components/NewsRecommendations";
import ReadySignal from "@/components/loading/ReadySignal";
import InfiniteNewsFeed from "@/components/InfiniteNewsFeed";
import { Iridescence } from '@/components/Backgrounds';

export default async function NewsPage() {
  const articles = await getGamingNews();

  return (
    <main className="relative w-full min-h-screen">
      {/* Background Layer z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Iridescence 
          color={[153/255, 27/255, 27/255]} // Darker crimson red
          mouseReact={false} // Keep false so it doesn't block clicks via a hack
          amplitude={1.2} // Increased for more visible distortion
          speed={2.0} // Increased for visible animation without mouse
        />
      </div>
      
      {/* Contrast/Readability Layer z-1 */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-black/40 via-black/70 to-black/95" />
      
      {/* Existing Content z-10 */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <ReadySignal />
        
        {/* CHAPTER 01: OPENING */}
        <section className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 font-bold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md">
            <Newspaper className="w-4 h-4" /> Editorial Stream
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.3)] tracking-tighter uppercase italic max-w-4xl">
            What is happening in the gaming world?
          </h1>
        </section>

        {/* CHAPTER 02: PRIMARY STORY & PERSONALIZED */}
        <section className="container mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
          {articles && articles.length > 0 ? (
            <div className="flex flex-col xl:flex-row gap-8 mb-16">
              {/* Massive Hero Article */}
              <div className="xl:w-2/3 flex flex-col border border-white/10 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden hover:border-purple-500/40 transition-all duration-500 group shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative cursor-pointer min-h-[400px] sm:min-h-[500px]">
                <div className="absolute inset-0 bg-purple-900/10 blur-[100px] pointer-events-none -z-10 group-hover:bg-purple-900/20 transition-colors duration-700" />
                
                {articles[0].image || articles[0].urlToImage ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 pointer-events-none"
                    style={{ 
                      backgroundImage: `url(${articles[0].image || articles[0].urlToImage})`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-white/20" />
                  </div>
                )}
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(168,85,247,0.1),transparent_60%)] mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-end h-full p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-purple-500/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">Headline</span>
                    <span className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md">{articles[0].source.name}</span>
                  </div>
                  <h3 className="font-black text-3xl sm:text-5xl mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] group-hover:text-purple-100 transition-colors tracking-tight leading-tight max-w-4xl">{articles[0].title}</h3>
                  <p className="text-base sm:text-xl text-white/70 mb-8 font-medium leading-relaxed max-w-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{articles[0].description}</p>
                  <div className="flex justify-between items-center border-t border-white/10 pt-6 mt-2">
                    {articles[0].url && (
                      <a href={articles[0].url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-2 transition-colors text-lg">
                        Read Full Story <span>→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Personalized Column */}
              <div className="xl:w-1/3 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white/90">Curated For You</h2>
                  <div className="h-px bg-white/10 flex-1 ml-4" />
                </div>
                <div className="flex-1 bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
                  <NewsRecommendations />
                </div>
              </div>
            </div>
          ) : (
             <div className="text-center py-20 bg-black/20 border border-white/5 rounded-3xl">
               <p className="text-zinc-400 text-lg">Loading news...</p>
             </div>
          )}
        </section>

        {/* CHAPTER 03: DEEPER FEED */}
        {articles && articles.length > 1 && (
          <section className="container mx-auto px-4 mb-20 relative">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-white/90">Current Stories</h2>
              <div className="h-px bg-white/10 flex-1 ml-6" />
            </div>
            <InfiniteNewsFeed initialArticles={articles.slice(1)} />
          </section>
        )}
      </div>
    </main>
  );
}
