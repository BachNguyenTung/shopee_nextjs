/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    connect-src 'self'
        https://*.googleapis.com
        https://*.cloudfunctions.net
        https://*.firebase.com
        https://*.firebaseio.com
        https://*.stripe.com
        http://localhost:*
        https://localhost:*;
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
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
    domains: ['res.cloudinary.com', 'fakestoreapi.com'],
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
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
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
            value: 'public, max-age=3600, must-revalidate',
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
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
