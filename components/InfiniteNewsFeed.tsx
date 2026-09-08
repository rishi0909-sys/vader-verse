"use client";

import { useEffect, useState, useRef } from "react";
import { Newspaper, Loader2 } from "lucide-react";

type Article = {
  title: string;
  description: string;
  url: string;
  image?: string;
  urlToImage?: string;
  source: { name: string };
};

export default function InfiniteNewsFeed({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(2); // Since initialArticles is page 1
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, page]);

  const fetchMoreArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news?page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      if (data.articles && data.articles.length > 0) {
        setArticles((prev) => [...prev, ...data.articles]);
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more news:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[300px] gap-6">
        {articles.map((article: Article, index: number) => {
          let spanClasses = "md:col-span-1 md:row-span-1";
          if (index % 5 === 0) {
            spanClasses = "md:col-span-2 md:row-span-2";
          } else if (index % 5 === 3) {
            spanClasses = "md:col-span-1 md:row-span-2";
          } else if (index % 5 === 4) {
            spanClasses = "md:col-span-2 md:row-span-1";
          }

          const imageUrl = article.image || article.urlToImage;

          return (
            <div key={`${article.title}-${index}`} className={`flex flex-col border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:bg-black/60 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group ${spanClasses}`}>
              <div className="overflow-hidden relative shrink-0 flex-1 min-h-[150px]">
                {imageUrl ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                    style={{ 
                      backgroundImage: `url(${imageUrl})`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 p-6 flex flex-col z-10 w-full">
                  <h3 className={`font-bold mb-3 line-clamp-2 text-white/90 drop-shadow-md group-hover:text-white transition-colors ${index % 5 === 0 ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
                    {article.title}
                  </h3>
                  <p className={`text-white/50 mb-4 line-clamp-2 font-medium leading-relaxed ${index % 5 === 0 || index % 5 === 4 ? 'text-base sm:text-lg block' : 'text-sm hidden sm:block'}`}>
                    {article.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-white/40 font-semibold pt-4 border-t border-white/10 mt-auto">
                    <span className="bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">{article.source.name}</span>
                    {article.url && (
                      <a href={article.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                        Read Full <span className="text-[10px]">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading Indicator and Intersection Target */}
      <div ref={observerTarget} className="flex justify-center items-center py-12 mt-8">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="text-sm font-semibold tracking-widest uppercase">Loading More...</span>
          </div>
        ) : !hasMore && articles.length > 0 ? (
          <div className="text-white/30 text-sm font-semibold tracking-widest uppercase">
            You have reached the end of the news.
          </div>
        ) : null}
      </div>
    </>
  );
}
