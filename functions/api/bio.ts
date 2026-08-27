interface Env {
  VITE_EMDASH_URL?: string;
  VITE_EMDASH_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const emdashUrl = context.env.VITE_EMDASH_URL;
  const emdashKey = context.env.VITE_EMDASH_API_KEY;

  if (!emdashUrl) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error: VITE_EMDASH_URL is not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (emdashKey) {
    headers['Authorization'] = `Bearer ${emdashKey}`;
  }

  try {
    const res = await fetch(`${emdashUrl}/_emdash/api/content/bio?limit=1&status=published`, {
      headers,
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Emdash error: ${res.statusText}` }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const json: any = await res.json();
    const item = json.data?.items?.[0] ?? null;

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch bio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
