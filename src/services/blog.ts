import { getEmDashContent, getEmDashEntry, EmDashEntry } from "@/lib/emdash";
import type { PortableTextBlock } from "@portabletext/types";

export interface BlogPostData {
    title: string;
    excerpt?: string;
    thumbnail?: any;
    author?: string;
    content?: PortableTextBlock[] | string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: PortableTextBlock[] | string;
    excerpt: string;
    thumbnail?: string;
    author: string;
    status: string;
    created: string;
    updated: string;
}

export interface PaginatedBlogPosts {
    items: BlogPost[];
    total: number;
}

export interface GetListPostsOptions {
    page?: number;
    limit?: number;
    status?: string;
}

export function resolveImageUrl(image: any): string {
    if (!image) return "";
    if (typeof image === "string") return image;
    if (typeof image === "object") {
        if (image.url) return image.url;
        if (image.asset?.url) return image.asset.url;
        const storageKey =
            image.meta?.storageKey ||
            image.storageKey ||
            image.asset?.meta?.storageKey ||
            image.asset?.storageKey;
        if (storageKey) return `/_emdash/api/media/file/${storageKey}`;
    }
    return "";
}

export function mapEntryToBlogPost(entry: EmDashEntry<BlogPostData>): BlogPost {
    const imageUrl = resolveImageUrl(entry.data?.thumbnail);

    return {
        id: entry.id,
        title: entry.data?.title || "Untitled Post",
        slug: entry.slug || entry.id,
        content: entry.data?.content || "",
        excerpt: entry.data?.excerpt || "",
        thumbnail: imageUrl || undefined,
        author: entry.data?.author || "Aqshol",
        status: entry.status || "published",
        created: entry.publishedAt || entry.createdAt,
        updated: entry.updatedAt,
    };
}

export async function getListPosts(options: GetListPostsOptions = {}): Promise<PaginatedBlogPosts> {
    const page = Math.max(1, options.page || 1);
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    // 1. Try Cloudflare Pages edge cache (/api/posts) in production
    if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
        try {
            const edgeRes = await fetch(`/api/posts?limit=${limit}&offset=${offset}`);
            if (edgeRes.ok) {
                const data = await edgeRes.json();
                if (data && Array.isArray(data.items)) {
                    return {
                        items: data.items.map(mapEntryToBlogPost),
                        total: data.total ?? data.items.length,
                    };
                } else if (Array.isArray(data)) {
                    return {
                        items: data.map(mapEntryToBlogPost),
                        total: data.length,
                    };
                }
            }
        } catch (_) {}
    }

    // 2. Fetch directly from Emdash CMS
    try {
        const response = await getEmDashContent<BlogPostData>('posts', {
            limit,
            offset,
            status: options.status || 'published',
            orderBy: 'createdAt',
            order: 'desc',
        });
        return {
            items: (response.items || []).map(mapEntryToBlogPost),
            total: response.total ?? (response.items?.length || 0),
        };
    } catch (error) {
        console.error('Failed to fetch posts from Emdash:', error);
        return { items: [], total: 0 };
    }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!slug) return null;

    // 1. Try Cloudflare Pages edge cache (/api/posts?slug=...) in production
    if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
        try {
            const edgeRes = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`);
            if (edgeRes.ok) {
                const item = await edgeRes.json();
                if (item && (item.id || item.slug)) {
                    return mapEntryToBlogPost(item);
                }
            }
        } catch (_) {}
    }

    // 2. Fetch directly from Emdash CMS
    try {
        // Try getting by slug or ID
        const entry = await getEmDashEntry<BlogPostData>('posts', slug);
        if (entry) {
            return mapEntryToBlogPost(entry);
        }

        // Fallback: search by slug filter
        const response = await getEmDashContent<BlogPostData>('posts', {
            slug,
            limit: 1,
        });
        if (response.items && response.items.length > 0) {
            return mapEntryToBlogPost(response.items[0]);
        }

        return null;
    } catch (error) {
        console.error(`Failed to fetch post for slug ${slug} from Emdash:`, error);
        return null;
    }
}
