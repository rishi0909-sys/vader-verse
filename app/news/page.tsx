import { getGamingNews } from "@/services/newsService";
import { Newspaper } from "lucide-react";
import Link from "next/link";
import NewsRecommendations from "@/components/NewsRecommendations";
import ReadySignal from "@/components/loading/ReadySignal";
import { Iridescence } from '@/components/Backgrounds';

export default async function NewsPage() {
  const articles = await getGamingNews();

  return (
    <main className="relative w-full min-h-screen">
      {/* Background Layer z-0 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Iridescence 
          color={[153/255, 27/255, 27/255]} // Darker crimson red
          mouseReact={false} // Match standard behavior
          amplitude={0.3}
          speed={0.5}
        />
      </div>
      
      {/* Contrast/Readability Layer z-1 */}
      <div className="fixed inset-0 pointer-events-none z-1 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
      
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
              <div className="xl:w-2/3 flex flex-col border border-white/10 bg-black/40 backdrop-blur-md rounded-3xl overflow-hidden hover:border-purple-500/40 transition-all duration-500 group shadow-2xl relative">
                <div className="absolute inset-0 bg-purple-900/10 blur-[100px] pointer-events-none -z-10 group-hover:bg-purple-900/20 transition-colors duration-700" />
                <div className="h-64 sm:h-96 w-full relative overflow-hidden shrink-0">
                  {articles[0].urlToImage ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 pointer-events-none"
                      style={{ 
                        backgroundImage: `url(${articles[0].urlToImage})`,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
                <div className="p-8 flex flex-col flex-1 -mt-32 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-purple-500/80 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">Headline</span>
                    <span className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-bold border border-white/10 backdrop-blur-md">{articles[0].source.name}</span>
                  </div>
                  <h3 className="font-black text-3xl sm:text-4xl mb-4 text-white drop-shadow-md group-hover:text-purple-100 transition-colors tracking-tight leading-tight">{articles[0].title}</h3>
                  <p className="text-base sm:text-lg text-white/60 mb-8 flex-1 font-medium leading-relaxed max-w-3xl">{articles[0].description}</p>
                  <div className="flex justify-between items-center mt-auto border-t border-white/10 pt-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(1).map((article: any, index: number) => (
                <div key={index} className="flex flex-col border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:bg-black/60 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group">
                  <div className="overflow-hidden h-48 relative shrink-0">
                    {article.urlToImage ? (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                        style={{ 
                          backgroundImage: `url(${article.urlToImage})`,
                          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 -mt-8 relative z-10">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-white/90 drop-shadow-md group-hover:text-white transition-colors">{article.title}</h3>
                    <p className="text-sm text-white/50 mb-6 line-clamp-3 flex-1 font-medium leading-relaxed">{article.description}</p>
                    <div className="flex justify-between items-center text-xs text-white/40 font-semibold mt-auto pt-4 border-t border-white/10">
                      <span className="bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{article.source.name}</span>
                      {article.url && (
                        <a href={article.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                          Read Full <span className="text-[10px]">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
