import { getGamingNews } from "@/services/newsService";
import { Newspaper } from "lucide-react";
import Link from "next/link";

export default async function NewsPage() {
  const articles = await getGamingNews();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Gaming News</h1>

      {/* Morning Digest Placeholder */}
      <section className="mb-12 rounded-2xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800 to-zinc-900 p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Newspaper className="w-48 h-48" />
        </div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 relative z-10">
          <span className="text-yellow-500">☀️</span> Your Morning Gaming Digest
        </h2>
        <p className="text-zinc-400 mb-6 relative z-10 max-w-2xl">
          AI-curated news tailored to your favorite genres. (Placeholder for Phase 2 implementation)
        </p>
        <div className="space-y-4 relative z-10">
          <div className="h-6 w-3/4 rounded bg-zinc-700 animate-pulse" />
          <div className="h-6 w-full rounded bg-zinc-700 animate-pulse" />
          <div className="h-6 w-5/6 rounded bg-zinc-700 animate-pulse" />
        </div>
      </section>

      {/* News Feed */}
      <h2 className="text-2xl font-bold mb-6">Latest Feed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles && articles.length > 0 ? (
          articles.map((article: any, index: number) => (
            <div key={index} className="flex flex-col border border-zinc-800 bg-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
              {article.urlToImage ? (
                <div 
                  className="h-48 bg-zinc-800 bg-cover bg-center"
                  style={{ backgroundImage: `url(${article.urlToImage})` }}
                />
              ) : (
                <div className="h-48 bg-zinc-800 flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-zinc-600" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-3 flex-1">{article.description}</p>
                <div className="flex justify-between items-center text-xs text-zinc-500 font-medium mt-auto">
                  <span>{article.source.name}</span>
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noreferrer" className="text-red-500 hover:text-red-400">
                      Read Full
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-400 col-span-full">Loading news...</p>
        )}
      </div>
    </div>
  );
}
