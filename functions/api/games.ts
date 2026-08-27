interface Env {
  VITE_EMDASH_URL?: string;
  VITE_EMDASH_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const emdashUrl = context.env.VITE_EMDASH_URL;
  const emdashKey = context.env.VITE_EMDASH_API_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (emdashKey) {
    headers['Authorization'] = `Bearer ${emdashKey}`;
  }

  const endpoint = id
    ? `${emdashUrl}/_emdash/api/content/games/${encodeURIComponent(id)}`
    : `${emdashUrl}/_emdash/api/content/games?status=published`;

  try {
    const res = await fetch(endpoint, { headers });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Emdash error: ${res.statusText}` }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const json: any = await res.json();
    const data = id ? (json.data?.item ?? json.data ?? null) : (json.data?.items ?? []);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch games' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
