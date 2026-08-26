interface Env {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

const CRAWLER_USER_AGENTS = [
  'bot',
  'spider',
  'crawl',
  'twitterbot',
  'facebookexternalhit',
  'discordbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'googlebot',
  'bingbot',
  'yandexbot',
  'applebot',
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
    /\.(js|css|webp|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|json|xml|txt)$/i.test(pathname)
  ) {
    return context.next();
  }

  const userAgent = context.request.headers.get('user-agent');
  const blogSlug = url.searchParams.get('blog_slug');

  // If not a crawler or no blog slug specified, serve the standard SPA
  if (!isCrawler(userAgent) || !blogSlug) {
    return context.next();
  }

  const supabaseUrl = context.env.SUPABASE_URL || context.env.VITE_SUPABASE_URL;
  const supabaseKey = context.env.SUPABASE_ANON_KEY || context.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return context.next();
  }

  try {
    const postRes = await fetch(
      `${supabaseUrl}/rest/v1/posts?slug=eq.${encodeURIComponent(blogSlug)}&select=*`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Accept: 'application/vnd.pgrst.object+json',
        },
      }
    );

    if (!postRes.ok) {
      return context.next();
    }

    const post = (await postRes.json()) as {
      title?: string;
      excerpt?: string;
      thumbnail?: string;
      slug?: string;
    };

    if (!post || !post.title) {
      return context.next();
    }

    const response = await context.next();
    const title = escapeHtml(post.title);
    const description = escapeHtml(post.excerpt || post.title);
    const thumbnailUrl = post.thumbnail
      ? `${supabaseUrl}/storage/v1/object/public/media/${post.thumbnail}`
      : 'https://shola.pro/assets/wallpaper/desktop.webp';
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
