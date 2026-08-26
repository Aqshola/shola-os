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
  try {
    if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
      const edgeRes = await fetch('/api/bio');
      if (edgeRes.ok) {
        const data = await edgeRes.json();
        if (Array.isArray(data) && data.length > 0) return data[0];
      }
    }
  } catch (_) {}

  const { data } = await supabase.from('bio').select('*');
  return data?.[0];
}
