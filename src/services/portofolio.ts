import { getEmDashContent, getEmDashEntry, EmDashEntry } from "@/lib/emdash";
import type { PortableTextBlock } from "@portabletext/types";

export type PortofolioStatus = "Discontinue" | "Published" | "Development" | "Initial";

export interface PortfolioData {
    title: string;
    image_cover?: any;
    link?: string;
    repo?: string;
    project_status?: PortofolioStatus;
    private?: boolean | number;
    content?: PortableTextBlock[] | string;
}

export interface Portfolio {
    id: string;
    title?: string;
    image_cover?: string;
    content?: PortableTextBlock[] | string;
    repo?: string;
    link?: string;
    status?: PortofolioStatus;
    private?: boolean;
    created: string;
    updated: string;
}

export function mapEntryToPortfolio(entry: EmDashEntry<PortfolioData>): Portfolio {
    const imageCover = entry.data?.image_cover;
    let imageUrl = "";
    if (typeof imageCover === "string") {
        imageUrl = imageCover;
    } else if (imageCover && typeof imageCover === "object") {
        imageUrl = imageCover.url 
            || (imageCover.meta?.storageKey ? `/_emdash/api/media/file/${imageCover.meta.storageKey}` : "")
            || (imageCover.storageKey ? `/_emdash/api/media/file/${imageCover.storageKey}` : "");
    }

    return {
        id: entry.id,
        title: entry.data?.title,
        image_cover: imageUrl,
        content: entry.data?.content,
        repo: entry.data?.repo,
        link: entry.data?.link,
        status: (entry.data?.project_status as PortofolioStatus) || "Published",
        private: Boolean(entry.data?.private),
        created: entry.createdAt,
        updated: entry.updatedAt,
    };
}

export async function getListPortofolio(): Promise<Portfolio[]> {
    // 1. Try Cloudflare Pages edge cache (/api/portfolio) in production
    if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
        try {
            const edgeRes = await fetch('/api/portfolio');
            if (edgeRes.ok) {
                const items: EmDashEntry<PortfolioData>[] = await edgeRes.json();
                if (Array.isArray(items)) {
                    return items.map(mapEntryToPortfolio);
                }
            }
        } catch (_) {}
    }

    // 2. Fetch directly from Emdash CMS
    try {
        const response = await getEmDashContent<PortfolioData>('portfolio', { status: 'published' });
        return (response.items || []).map(mapEntryToPortfolio);
    } catch (error) {
        console.error('Failed to fetch portfolio from Emdash:', error);
        return [];
    }
}

export async function getDetailPortofolio(id: string): Promise<Portfolio | null> {
    // 1. Try Cloudflare Pages edge cache (/api/portfolio?id=...) in production
    if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
        try {
            const edgeRes = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`);
            if (edgeRes.ok) {
                const item: EmDashEntry<PortfolioData> = await edgeRes.json();
                if (item?.id) {
                    return mapEntryToPortfolio(item);
                }
            }
        } catch (_) {}
    }

    // 2. Fetch directly from Emdash CMS
    try {
        const entry = await getEmDashEntry<PortfolioData>('portfolio', id);
        if (!entry) return null;
        return mapEntryToPortfolio(entry);
    } catch (error) {
        console.error(`Failed to fetch portfolio detail for ${id} from Emdash:`, error);
        return null;
    }
}
