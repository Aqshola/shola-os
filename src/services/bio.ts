import { supabase } from "@/lib/supabase";

export interface Bio {
  id: string;
  name: string;
  desc: string;
  avatar?: string;
  created: string;
  updated: string;
}

export async function getBio(): Promise<Bio> {
  const { data } = await supabase.from('bio').select('*')
  return data?.[0]
}
