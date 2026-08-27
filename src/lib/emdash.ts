export interface EmDashEntry<T = Record<string, any>> {
  id: string;
  type: string;
  slug: string;
  status: string;
  data: T;
  authorId?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface EmDashListResponse<T = Record<string, any>> {
  items: EmDashEntry<T>[];
  total: number;
  nextCursor?: string;
}

export interface EmDashContentOptions {
  limit?: number;
  offset?: number;
  status?: string;
  orderBy?: string;
  order?: "asc" | "desc";
  slug?: string;
  locale?: string;
}

const EMDASH_URL = import.meta.env?.VITE_EMDASH_URL || "";
const EMDASH_API_KEY = import.meta.env?.VITE_EMDASH_API_KEY;

function getHeaders(customHeaders?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (EMDASH_API_KEY) {
    headers["Authorization"] = `Bearer ${EMDASH_API_KEY}`;
  }
  return {
    ...headers,
    ...(customHeaders as Record<string, string>),
  };
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return EMDASH_URL;
}

export async function getEmDashContent<T = Record<string, any>>(
  collection: string,
  options?: EmDashContentOptions
): Promise<EmDashListResponse<T>> {
  const base = getBaseUrl();
  const params = new URLSearchParams();

  if (options?.limit) params.set("limit", options.limit.toString());
  if (options?.offset !== undefined) params.set("offset", options.offset.toString());
  if (options?.status) params.set("status", options.status);
  if (options?.orderBy) params.set("orderBy", options.orderBy);
  if (options?.order) params.set("order", options.order);
  if (options?.slug) params.set("slug", options.slug);
  if (options?.locale) params.set("locale", options.locale);

  const query = params.toString() ? `?${params.toString()}` : "";
  const url = `${base}/_emdash/api/content/${collection}${query}`;

  const res = await fetch(url, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${collection} from Emdash: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? { items: [], total: 0 };
}

export async function getEmDashEntry<T = Record<string, any>>(
  collection: string,
  idOrSlug: string
): Promise<EmDashEntry<T> | null> {
  const base = getBaseUrl();
  const url = `${base}/_emdash/api/content/${collection}/${encodeURIComponent(idOrSlug)}`;

  const res = await fetch(url, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch ${collection}/${idOrSlug} from Emdash: ${res.statusText}`);
  }
  const body = await res.json();
  return body.data?.item ?? null;
}

