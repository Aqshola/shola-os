import { supabase, getFileUrl } from "@/lib/supabase";

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
    try {
        if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
            const edgeRes = await fetch('/api/posts');
            if (edgeRes.ok) {
                const data = await edgeRes.json();
                return (data ?? []).map((record: any) => ({
                    ...record,
                    thumbnail: record.thumbnail ? getFileUrl(record.thumbnail) : undefined,
                }));
            }
        }
    } catch (_) {}

    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'post')
        .order('created', { ascending: false })
        .range(0, 49);

    return (data ?? []).map(record => ({
        ...record,
        thumbnail: record.thumbnail ? getFileUrl(record.thumbnail) : undefined,
    }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
            const edgeRes = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`);
            if (edgeRes.ok) {
                const data = await edgeRes.json();
                if (data && data.title) {
                    return {
                        ...data,
                        thumbnail: data.thumbnail ? getFileUrl(data.thumbnail) : undefined,
                    };
                }
            }
        }
    } catch (_) {}

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) return null;

        return {
            ...data,
            thumbnail: data.thumbnail ? getFileUrl(data.thumbnail) : undefined,
        };
    } catch (e) {
        return null;
    }
}
