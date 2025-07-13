/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    connect-src 'self'
        ws://localhost:*
        https://*.googleapis.com
        https://*.cloudfunctions.net
        https://*.firebase.com
        https://*.firebaseio.com
        https://*.stripe.com
        https://*.pusher.com
        https://*.pusherapp.com
        wss://*.pusher.com
        wss://*.pusherapp.com
        ws://*.pusher.com
        ws://*.pusherapp.com
        http://localhost:*
        https://localhost:*;
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
        https://esm.sh
        blob:
        https://js.pusher.com
        https://*.stripe.com
        https://*.vercel.live;
    style-src 'self' 'unsafe-inline'
        https://rsms.me;
    img-src 'self' blob: data:
        res.cloudinary.com
        fakestoreapi.com
        firebasestorage.googleapis.com
        *.googleusercontent.com
        storage.googleapis.com;
    font-src 'self' data:
        https://rsms.me;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src
        https://*.stripe.com;
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'fakestoreapi.com', 'firebasestorage.googleapis.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, '')
          },
          {
            key: "Set-Cookie",
            value: "HttpOnly; SameSite=Strict",
          }
        ],
      },
      // API routes caching - Next.js doesn't auto-cache these
      {
        source: '/api/products',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=300, stale-while-revalidate=600',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=300',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        source: '/api/validate-cart',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/api/socket',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      // Search page caching - Override Next.js default no-cache for SSR
      {
        source: '/search',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate=300',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=60',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, Accept-Language',
          },
        ],
      },
      // Custom static files - Next.js doesn't auto-cache these
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate=7200',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=3600',
          },
        ],
      },
      {
        source: '/api/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/xml',
          },
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate=7200',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=3600',
          },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 's-maxage=3600, stale-while-revalidate=7200',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=3600',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
