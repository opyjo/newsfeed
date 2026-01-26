import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "./db";

export interface Article {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    publishedAt?: string;
    contentSnippet?: string;
    source: string;
    fetchedAt: string;
}

export async function getArticles() {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
            Limit: 50, // Limit for MVP
        });
        const result = await docClient.send(command);

        // Sort by date descending
        const items = (result.Items as Article[]) || [];
        return items.sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.pubDate || 0);
            const dateB = new Date(b.publishedAt || b.pubDate || 0);
            return dateB.getTime() - dateA.getTime();
        });
    } catch (err) {
        console.error("Error fetching articles:", err);
        return [];
    }
}
