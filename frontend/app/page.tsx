import { getArticles } from "@/lib/actions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
    const articles = await getArticles();

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
                        AI News Feed
                    </h1>
                    <p className="text-gray-400">
                        Curated updates from OpenAI, Google, DeepMind, and more.
                    </p>
                    <div className="text-sm text-gray-500 mt-2">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </header>

                <div className="space-y-6">
                    {articles.length === 0 ? (
                        <div className="text-center py-20 bg-gray-800 rounded-lg">
                            <p className="text-xl text-gray-400">No articles found yet or initial sync in progress.</p>
                            <p className="text-sm text-gray-500 mt-2">Make sure Consumer is running!</p>
                        </div>
                    ) : (
                        articles.map((article) => (
                            <a
                                key={article.id}
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <article className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-semibold px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-800">
                                            {article.source}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {dayjs(article.publishedAt || article.pubDate).fromNow()}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                        {article.contentSnippet}
                                    </p>
                                </article>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
