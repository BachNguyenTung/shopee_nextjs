/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    connect-src 'self'
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
        https://js.pusher.com
        https://*.stripe.com
        https://*.vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:
        res.cloudinary.com
        fakestoreapi.com
        firebasestorage.googleapis.com
        *.googleusercontent.com
        storage.googleapis.com;
    font-src 'self' data:;
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
  swcMinify: true,
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
      // Static assets caching
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=31536000',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=31536000',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
      // API routes caching
      {
        source: '/api/products',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=300, stale-while-revalidate=600',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=300',
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
      // Search page caching
      {
        source: '/search',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate=300',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=60',
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
      // Static files caching
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
            key: 'CDN-Cache-Control',
            value: 'max-age=3600',
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
            key: 'CDN-Cache-Control',
            value: 'max-age=3600',
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
            key: 'CDN-Cache-Control',
            value: 'max-age=3600',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=3600',
          },
        ],
      },
      // General static assets
      {
        source: '/:path*.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=31536000',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
