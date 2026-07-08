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
    const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'post')
        .order('created', { ascending: false })
        .range(0, 49)

    return (data ?? []).map(record => ({
        ...record,
        thumbnail: record.thumbnail ? getFileUrl(record.thumbnail) : undefined,
    }))
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error || !data) return null

        return {
            ...data,
            thumbnail: data.thumbnail ? getFileUrl(data.thumbnail) : undefined,
        }
    } catch (e) {
        return null
    }
}
