interface Env {
  VITE_EMDASH_URL?: string;
  VITE_EMDASH_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get('slug');
  const limit = url.searchParams.get('limit') || '10';
  const offset = url.searchParams.get('offset') || '0';

  const emdashUrl = context.env.VITE_EMDASH_URL;
  const emdashKey = context.env.VITE_EMDASH_API_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (emdashKey) {
    headers['Authorization'] = `Bearer ${emdashKey}`;
  }

  const endpoint = slug
    ? `${emdashUrl}/_emdash/api/content/posts/${encodeURIComponent(slug)}`
    : `${emdashUrl}/_emdash/api/content/posts?status=published&orderBy=createdAt&order=desc&limit=${limit}&offset=${offset}`;

  try {
    const res = await fetch(endpoint, { headers });
    if (!res.ok) {
      if (slug && res.status === 404) {
        // Try querying by slug query param
        const fallbackRes = await fetch(
          `${emdashUrl}/_emdash/api/content/posts?slug=${encodeURIComponent(slug)}&limit=1`,
          { headers }
        );
        if (fallbackRes.ok) {
          const fallbackJson: any = await fallbackRes.json();
          const item = fallbackJson.data?.items?.[0] || null;
          if (item) {
            return new Response(JSON.stringify(item), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        }
      }

      return new Response(JSON.stringify({ error: `Emdash error: ${res.statusText}` }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const json: any = await res.json();
    const data = slug
      ? (json.data?.item ?? json.data ?? null)
      : {
          items: json.data?.items ?? [],
          total: json.data?.total ?? (json.data?.items?.length || 0),
        };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
