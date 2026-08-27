import { getEmDashContent, EmDashEntry } from "@/lib/emdash";
import type { PortableTextBlock } from "@portabletext/types";

export interface BioData {
  name: string;
  desc: PortableTextBlock[];
  avatar?: string;
}

export interface Bio {
  id: string;
  name: string;
  desc: PortableTextBlock[];
  avatar?: string;
  created: string;
  updated: string;
}

function mapEntryToBio(entry: EmDashEntry<BioData>): Bio {
  return {
    id: entry.id,
    name: entry.data.name,
    desc: entry.data.desc,
    avatar: entry.data.avatar,
    created: entry.createdAt,
    updated: entry.updatedAt,
  };
}

export async function getBio(): Promise<Bio | null> {
  // 1. Try Cloudflare Pages edge cache (/api/bio) in production
  if (typeof window !== 'undefined' && window.location.origin && !import.meta.env.DEV) {
    try {
      const edgeRes = await fetch('/api/bio');
      if (edgeRes.ok) {
        const item: EmDashEntry<BioData> = await edgeRes.json();
        if (item?.data) {
          return mapEntryToBio(item);
        }
      }
    } catch (_) {}
  }

  // 2. Fetch directly from Emdash CMS
  try {
    const response = await getEmDashContent<BioData>('bio', { limit: 1, status: 'published' });
    const entry = response.items[0];
    if (!entry?.data) return null;

    return mapEntryToBio(entry);
  } catch (error) {
    console.error('Failed to fetch bio from Emdash:', error);
    return null;
  }
}

