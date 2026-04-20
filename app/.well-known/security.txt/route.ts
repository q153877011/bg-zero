/**
 * app/.well-known/security.txt/route.ts
 * RFC 9116 — Security contact information
 * https://securitytxt.org/
 */
export function GET() {
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString()

  const body = [
    'Contact: mailto:security@bg-zero.tech',
    `Expires: ${expires}`,
    'Preferred-Languages: en, zh',
    'Canonical: https://bg-zero.tech/.well-known/security.txt',
    'Policy: https://bg-zero.tech/security',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
