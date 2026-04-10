import { pb, getFileUrl } from "@/lib/pocketbase";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    thumbnail?: string;
    author: string;
    status: string;
    created: string;
    updated: string;
}

export async function getListPosts(): Promise<BlogPost[]> {
    const records = await pb.collection("posts").getList<BlogPost>(1, 50, {
        filter: 'status = "published"',
        sort: "-created",
    });
    
    return records.items.map(record => ({
        ...record,
        thumbnail: record.thumbnail ? getFileUrl("posts", record.id, record.thumbnail) : undefined,
    }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const record = await pb.collection("posts").getFirstListItem<BlogPost>(`slug = "${slug}"`);
        return {
            ...record,
            thumbnail: record.thumbnail ? getFileUrl("posts", record.id, record.thumbnail) : undefined,
        };
    } catch (e) {
        return null;
    }
}