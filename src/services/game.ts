import { getEmDashContent, getEmDashEntry, EmDashEntry } from "@/lib/emdash";

export interface GameData {
  name: string;
  icon?: any;
  rom?: any;
  description?: string;
  genre?: string;
  releaseYear?: string;
  developer?: string;
  players?: string;
}

export interface GameItem {
  id: string;
  title: string;
  cover: string;
  romUrl: string;
  description?: string;
  genre?: string;
  releaseYear?: string;
  developer?: string;
  players?: string;
}

function getMediaUrl(media: any): string {
  if (!media) return "";
  if (typeof media === "string") return media;
  if (typeof media === "object") {
    if (media.url) return media.url;
    if (media.meta?.storageKey) return `/_emdash/api/media/file/${media.meta.storageKey}`;
    if (media.storageKey) return `/_emdash/api/media/file/${media.storageKey}`;
  }
  return "";
}

export function mapEntryToGame(entry: EmDashEntry<GameData>): GameItem {
  return {
    id: entry.slug || entry.id,
    title: entry.data?.name || entry.slug || "Untitled Game",
    cover: getMediaUrl(entry.data?.icon) || "/assets/placeholder.png",
    romUrl: getMediaUrl(entry.data?.rom),
    description: entry.data?.description || "",
    genre: entry.data?.genre || "NES / 8-Bit",
    releaseYear: entry.data?.releaseYear || "",
    developer: entry.data?.developer || "",
    players: entry.data?.players || "1-2 Players",
  };
}

export async function getListGames(): Promise<GameItem[]> {
  // 1. Try Cloudflare Pages edge cache (/api/games) in production
  if (typeof window !== "undefined" && window.location.origin && !import.meta.env.DEV) {
    try {
      const edgeRes = await fetch("/api/games");
      if (edgeRes.ok) {
        const items: EmDashEntry<GameData>[] = await edgeRes.json();
        if (Array.isArray(items)) {
          return items.map(mapEntryToGame);
        }
      }
    } catch (_) {}
  }

  // 2. Fetch directly from Emdash CMS
  try {
    const response = await getEmDashContent<GameData>("games", { status: "published" });
    return (response.items || []).map(mapEntryToGame);
  } catch (error) {
    console.error("Failed to fetch games from Emdash:", error);
    return [];
  }
}

export async function getGameDetail(id: string): Promise<GameItem | null> {
  if (typeof window !== "undefined" && window.location.origin && !import.meta.env.DEV) {
    try {
      const edgeRes = await fetch(`/api/games?id=${encodeURIComponent(id)}`);
      if (edgeRes.ok) {
        const item: EmDashEntry<GameData> = await edgeRes.json();
        if (item?.id) {
          return mapEntryToGame(item);
        }
      }
    } catch (_) {}
  }

  try {
    const entry = await getEmDashEntry<GameData>("games", id);
    if (!entry) return null;
    return mapEntryToGame(entry);
  } catch (error) {
    console.error(`Failed to fetch game detail for ${id} from Emdash:`, error);
    return null;
  }
}
