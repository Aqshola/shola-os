interface Env {
  ASSETS: Fetcher;
  VITE_EMDASH_URL?: string;
  VITE_EMDASH_API_KEY?: string;
}

const CRAWLER_USER_AGENTS = [
  'bot',
  'spider',
  'crawl',
  'twitterbot',
  'facebookexternalhit',
  'meta-externalagent',
  'discordbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'googlebot',
  'bingbot',
  'yandexbot',
  'applebot',
  'pinterest',
  'redditbot',
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const lower = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((crawler) => lower.includes(crawler));
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const emdashUrl = env.VITE_EMDASH_URL;
    const emdashKey = env.VITE_EMDASH_API_KEY;

    // -------------------------------------------------------------
    // Route: /_emdash/* (Reverse Proxy to Emdash CMS)
    // -------------------------------------------------------------
    if (pathname.startsWith('/_emdash')) {
      if (!emdashUrl) {
        return new Response(
          JSON.stringify({ error: 'Internal Server Error: VITE_EMDASH_URL is not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      const baseTarget = emdashUrl.replace(/\/+$/, '');
      const targetUrl = `${baseTarget}${pathname}${url.search}`;
      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('Host', new URL(baseTarget).host);

      if (!forwardHeaders.has('Authorization') && emdashKey) {
        forwardHeaders.set('Authorization', `Bearer ${emdashKey}`);
      }

      try {
        const hasBody = !['GET', 'HEAD'].includes(request.method);
        const body = hasBody ? await request.arrayBuffer() : undefined;

        const emdashRes = await fetch(targetUrl, {
          method: request.method,
          headers: forwardHeaders,
          body,
        });

        const resHeaders = new Headers(emdashRes.headers);
        resHeaders.set('Access-Control-Allow-Origin', '*');

        return new Response(emdashRes.body, {
          status: emdashRes.status,
          statusText: emdashRes.statusText,
          headers: resHeaders,
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            error: err.message || 'Internal Server Error: Failed to proxy request to Emdash CMS',
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // -------------------------------------------------------------
    // Route: /api/bio
    // -------------------------------------------------------------
    if (pathname === '/api/bio') {
      if (!emdashUrl) {
        return new Response(
          JSON.stringify({ error: 'Internal Server Error: VITE_EMDASH_URL is not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (emdashKey) headers['Authorization'] = `Bearer ${emdashKey}`;

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
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Failed to fetch bio' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // -------------------------------------------------------------
    // Route: /api/posts
    // -------------------------------------------------------------
    if (pathname === '/api/posts') {
      if (!emdashUrl) {
        return new Response(
          JSON.stringify({ error: 'Internal Server Error: VITE_EMDASH_URL is not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const slug = url.searchParams.get('slug');
      const limit = url.searchParams.get('limit') || '10';
      const offset = url.searchParams.get('offset') || '0';

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (emdashKey) headers['Authorization'] = `Bearer ${emdashKey}`;

      const endpoint = slug
        ? `${emdashUrl}/_emdash/api/content/posts/${encodeURIComponent(slug)}`
        : `${emdashUrl}/_emdash/api/content/posts?status=published&orderBy=createdAt&order=desc&limit=${limit}&offset=${offset}`;

      try {
        const res = await fetch(endpoint, { headers });
        if (!res.ok) {
          if (slug && res.status === 404) {
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
                    'Cache-Control':
                      'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
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
          ? json.data?.item ?? json.data ?? null
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
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Failed to fetch posts' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // -------------------------------------------------------------
    // Route: /api/games
    // -------------------------------------------------------------
    if (pathname === '/api/games') {
      if (!emdashUrl) {
        return new Response(
          JSON.stringify({ error: 'Internal Server Error: VITE_EMDASH_URL is not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const id = url.searchParams.get('id');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (emdashKey) headers['Authorization'] = `Bearer ${emdashKey}`;

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
        const data = id ? json.data?.item ?? json.data ?? null : json.data?.items ?? [];
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Failed to fetch games' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // -------------------------------------------------------------
    // Route: /api/portfolio
    // -------------------------------------------------------------
    if (pathname === '/api/portfolio') {
      if (!emdashUrl) {
        return new Response(
          JSON.stringify({ error: 'Internal Server Error: VITE_EMDASH_URL is not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const id = url.searchParams.get('id');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (emdashKey) headers['Authorization'] = `Bearer ${emdashKey}`;

      const endpoint = id
        ? `${emdashUrl}/_emdash/api/content/portfolio/${encodeURIComponent(id)}`
        : `${emdashUrl}/_emdash/api/content/portfolio?status=published`;

      try {
        const res = await fetch(endpoint, { headers });
        if (!res.ok) {
          return new Response(JSON.stringify({ error: `Emdash error: ${res.statusText}` }), {
            status: res.status,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const json: any = await res.json();
        const data = id ? json.data?.item ?? json.data ?? null : json.data?.items ?? [];
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: err.message || 'Failed to fetch portfolio' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // -------------------------------------------------------------
    // Route: SSR / OpenGraph tags for Social Crawlers
    // -------------------------------------------------------------
    const userAgent = request.headers.get('user-agent');
    let blogSlug = url.searchParams.get('blog_slug');
    if (!blogSlug) {
      if (pathname.startsWith('/blog/') && pathname.length > 6) {
        blogSlug = decodeURIComponent(pathname.slice(6).split('/')[0]);
      } else if (pathname.startsWith('/blogs/') && pathname.length > 7) {
        blogSlug = decodeURIComponent(pathname.slice(7).split('/')[0]);
      }
    }

    if (isCrawler(userAgent) && blogSlug && emdashUrl) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (emdashKey) headers['Authorization'] = `Bearer ${emdashKey}`;

      try {
        let postRes = await fetch(
          `${emdashUrl}/_emdash/api/content/posts/${encodeURIComponent(blogSlug)}`,
          { headers }
        );
        if (!postRes.ok) {
          postRes = await fetch(
            `${emdashUrl}/_emdash/api/content/posts?slug=${encodeURIComponent(blogSlug)}&limit=1`,
            { headers }
          );
        }

        if (postRes.ok) {
          const postJson: any = await postRes.json();
          const item = postJson.data?.item || postJson.data?.items?.[0] || postJson.data;

          if (item && (item.data?.title || item.title)) {
            const titleText = item.data?.title || item.title || 'Blog Post';
            const excerptText = item.data?.excerpt || item.excerpt || titleText;
            const rawThumbnail = item.data?.thumbnail || item.thumbnail;

            let thumbnailUrl = 'https://shola.pro/assets/wallpaper/desktop.webp';
            if (typeof rawThumbnail === 'string' && rawThumbnail.length > 0) {
              thumbnailUrl = rawThumbnail.startsWith('http')
                ? rawThumbnail
                : `${url.origin}${rawThumbnail.startsWith('/') ? '' : '/'}${rawThumbnail}`;
            } else if (rawThumbnail && typeof rawThumbnail === 'object') {
              const directUrl = rawThumbnail.url || rawThumbnail.asset?.url;
              const storageKey =
                rawThumbnail.meta?.storageKey ||
                rawThumbnail.storageKey ||
                rawThumbnail.asset?.meta?.storageKey ||
                rawThumbnail.asset?.storageKey;

              if (directUrl) {
                thumbnailUrl = directUrl.startsWith('http')
                  ? directUrl
                  : `${url.origin}${directUrl.startsWith('/') ? '' : '/'}${directUrl}`;
              } else if (storageKey) {
                thumbnailUrl = `${url.origin}/_emdash/api/media/file/${storageKey}`;
              }
            }

            // Always fetch index.html template so HTMLRewriter mutates valid HTML
            const indexRequest = new Request(new URL('/index.html', request.url), request);
            let response = await env.ASSETS.fetch(indexRequest);
            if (!response.ok) {
              response = await env.ASSETS.fetch(request);
            }
            const title = escapeHtml(titleText);
            const description = escapeHtml(excerptText);
            const canonicalUrl = url.toString();

            return new HTMLRewriter()
              .on('title', {
                element(el) {
                  el.setInnerContent(`${title} - Shola OS`);
                },
              })
              .on('meta[name="title"]', {
                element(el) {
                  el.setAttribute('content', `${title} - Shola OS`);
                },
              })
              .on('meta[name="description"]', {
                element(el) {
                  el.setAttribute('content', description);
                },
              })
              .on('meta[property="og:title"]', {
                element(el) {
                  el.setAttribute('content', `${title} - Shola OS`);
                },
              })
              .on('meta[property="og:description"]', {
                element(el) {
                  el.setAttribute('content', description);
                },
              })
              .on('meta[property="og:url"]', {
                element(el) {
                  el.setAttribute('content', canonicalUrl);
                },
              })
              .on('meta[property="og:image"]', {
                element(el) {
                  el.setAttribute('content', thumbnailUrl);
                },
              })
              .on('meta[property="twitter:title"]', {
                element(el) {
                  el.setAttribute('content', `${title} - Shola OS`);
                },
              })
              .on('meta[property="twitter:description"]', {
                element(el) {
                  el.setAttribute('content', description);
                },
              })
              .on('meta[property="twitter:url"]', {
                element(el) {
                  el.setAttribute('content', canonicalUrl);
                },
              })
              .on('meta[property="twitter:image"]', {
                element(el) {
                  el.setAttribute('content', thumbnailUrl);
                },
              })
              .transform(response);
          }
        }
      } catch (_) {}
    }

    // -------------------------------------------------------------
    // All other requests -> Serve static assets with SPA fallback
    // -------------------------------------------------------------
    try {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status === 404) {
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        return await env.ASSETS.fetch(indexRequest);
      }
      return assetResponse;
    } catch (_) {
      const indexRequest = new Request(new URL('/index.html', request.url), request);
      return await env.ASSETS.fetch(indexRequest);
    }
  },
};
