import { supabase } from "@/lib/supabase";

export interface Social {
  id: string;
  name?: string;
  url?: string;
  created: string;
  updated: string;
}

export async function getListSocial(): Promise<Social[]> {
    const { data } = await supabase.from('social').select('*')
    return (data ?? []) as Social[]
}
