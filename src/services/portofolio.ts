import { supabase } from "@/lib/supabase";

export type PortofolioStatus = "Discontinue" | "Published" | "Development" | "Initial"
export type Portfolio = {
    id: string;
    title?: string;
    image_cover?: string;
    content?: string;
    repo?: string;
    link?: string;
    status?: PortofolioStatus;
    private?: boolean;
    created: string;
    updated: string;
};

export async function getListPortofolio(): Promise<Portfolio[]> {
    try {
        if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
            const edgeRes = await fetch('/api/portfolio');
            if (edgeRes.ok) {
                const data = await edgeRes.json();
                return (data ?? []) as Portfolio[];
            }
        }
    } catch (_) {}

    const { data } = await supabase.from('portofolio').select('*');
    return (data ?? []) as Portfolio[];
}

export async function getDetailPortofolio(id: string): Promise<Portfolio> {
    try {
        if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
            const edgeRes = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`);
            if (edgeRes.ok) {
                const data = await edgeRes.json();
                if (data && data.id) return data as Portfolio;
            }
        }
    } catch (_) {}

    const { data } = await supabase.from('portofolio').select('*').eq('id', id).single();
    return data as Portfolio;
}
