interface Env {
  VITE_EMDASH_URL?: string;
  VITE_EMDASH_API_KEY?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const emdashUrl = context.env.VITE_EMDASH_URL;
  const emdashKey = context.env.VITE_EMDASH_API_KEY;

  // Throw 500 Internal Server Error when env is not set
  if (!emdashUrl) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Handle CORS preflight OPTIONS request
  if (context.request.method === 'OPTIONS') {
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

  // Construct target URL: trim trailing slash from emdashUrl if present
  const baseTarget = emdashUrl.replace(/\/+$/, '');
  const targetUrl = `${baseTarget}${url.pathname}${url.search}`;

  // Clone headers
  const forwardHeaders = new Headers(context.request.headers);
  forwardHeaders.set('Host', new URL(baseTarget).host);

  // If Authorization is not provided in incoming request, inject the default API key
  if (!forwardHeaders.has('Authorization') && emdashKey) {
    forwardHeaders.set('Authorization', `Bearer ${emdashKey}`);
  }

  try {
    const hasBody = !['GET', 'HEAD'].includes(context.request.method);
    const body = hasBody ? await context.request.arrayBuffer() : undefined;

    const emdashResponse = await fetch(targetUrl, {
      method: context.request.method,
      headers: forwardHeaders,
      body,
    });

    const responseHeaders = new Headers(emdashResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(emdashResponse.body, {
      status: emdashResponse.status,
      statusText: emdashResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal Server Error: Failed to proxy request to Emdash CMS',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
