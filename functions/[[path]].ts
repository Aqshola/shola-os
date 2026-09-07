interface Env {
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

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Let static assets and API routes pass through directly
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_emdash/') ||
    /\.(js|css|webp|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|json|xml|txt)$/i.test(pathname)
  ) {
    return context.next();
  }

  const userAgent = context.request.headers.get('user-agent');
  let blogSlug = url.searchParams.get('blog_slug');
  if (!blogSlug) {
    if (pathname.startsWith('/blog/') && pathname.length > 6) {
      blogSlug = decodeURIComponent(pathname.slice(6).split('/')[0]);
    } else if (pathname.startsWith('/blogs/') && pathname.length > 7) {
      blogSlug = decodeURIComponent(pathname.slice(7).split('/')[0]);
    }
  }

  // If not a crawler or no blog slug specified, serve the standard SPA
  if (!isCrawler(userAgent) || !blogSlug) {
    return context.next();
  }

  const emdashUrl = context.env.VITE_EMDASH_URL;
  const emdashKey = context.env.VITE_EMDASH_API_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (emdashKey) {
    headers['Authorization'] = `Bearer ${emdashKey}`;
  }

  try {
    let postRes = await fetch(
      `${emdashUrl}/_emdash/api/content/posts/${encodeURIComponent(blogSlug)}`,
      { headers }
    );

    if (!postRes.ok) {
      // Try by slug filter
      postRes = await fetch(
        `${emdashUrl}/_emdash/api/content/posts?slug=${encodeURIComponent(blogSlug)}&limit=1`,
        { headers }
      );
    }

    if (!postRes.ok) {
      return context.next();
    }

    const postJson: any = await postRes.json();
    const item = postJson.data?.item || postJson.data?.items?.[0] || postJson.data;

    if (!item || (!item.data?.title && !item.title)) {
      return context.next();
    }

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

    const indexRequest = new Request(new URL('/index.html', url.origin), context.request);
    let response = await context.next(indexRequest);
    if (!response.ok) {
      response = await context.next();
    }
    const title = escapeHtml(titleText);
    const description = escapeHtml(excerptText);
    const canonicalUrl = url.toString();

    // Use Cloudflare HTMLRewriter to dynamically inject OpenGraph / Twitter tags for crawlers
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
  } catch (err) {
    return context.next();
  }
};
