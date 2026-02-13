import { getArticles } from "@/lib/actions";
import { NewsfeedClient } from "./components/NewsfeedClient";

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
    const articles = await getArticles();

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-[1600px] mx-auto">
                <NewsfeedClient articles={articles} />
            </div>
        </main>
    );
}
