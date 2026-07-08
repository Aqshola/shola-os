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
    const { data } = await supabase.from('portofolio').select('*')
    return (data ?? []) as Portfolio[]
}

export async function getDetailPortofolio(id: string): Promise<Portfolio> {
    const { data } = await supabase.from('portofolio').select('*').eq('id', id).single()
    return data as Portfolio
}
