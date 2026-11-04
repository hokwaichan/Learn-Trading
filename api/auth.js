// Vercel Edge Function: forwards /api/auth/* to Neon Auth so the sign-in cookie
// belongs to this site. Browsers that block third-party cookies (Safari, and
// every browser on iPhone and iPad) would otherwise drop it. vercel.json
// rewrites /api/auth/:path* here as ?path=:path*.
export const config = { runtime: 'edge' };

const NEON_AUTH = 'https://ep-dawn-rice-azxeoa3i.neonauth.c-3.ap-southeast-1.aws.neon.tech/neondb/auth';

// Headers that describe this hop, not the request, and must not be passed on.
const HOP = ['host', 'connection', 'content-length', 'forwarded', 'x-real-ip'];

export default async function handler(request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('path') ?? '';
  url.searchParams.delete('path');
  const target = `${NEON_AUTH}/${path}${url.search}`;

  const headers = new Headers();
  for (const [key, value] of request.headers) {
    const name = key.toLowerCase();
    if (HOP.includes(name) || name.startsWith('x-forwarded-') || name.startsWith('x-vercel-')) continue;
    headers.set(key, value);
  }

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.arrayBuffer(),
    redirect: 'manual',
  });

  const response = new Headers();
  for (const [key, value] of upstream.headers) {
    const name = key.toLowerCase();
    if (name === 'set-cookie' || name === 'content-encoding' || name === 'content-length' || name === 'transfer-encoding') continue;
    response.set(key, value);
  }
  // Keep every cookie, but scoped to this site rather than Neon's domain.
  for (const cookie of upstream.headers.getSetCookie?.() ?? []) {
    response.append('set-cookie', cookie.replace(/;\s*domain=[^;]*/gi, ''));
  }
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: response });
}
