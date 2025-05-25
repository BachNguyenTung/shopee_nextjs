/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    connect-src 'self' https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://us-central1-shopee-demo-c6d2b.cloudfunctions.net https://firebasestorage.googleapis.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' localhost;
    img-src 'self' blob: data: res.cloudinary.com fakestoreapi.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

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
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: "Set-Cookie",
            value: "HttpOnly; SameSite=Strict",
          }
        ],
      },
    ]
  },
};

module.exports = nextConfig;
