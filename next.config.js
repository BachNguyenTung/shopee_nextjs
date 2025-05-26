/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    connect-src 'self'
        https://*.googleapis.com
        https://us-central1-shopee-demo-c6d2b.cloudfunctions.net
        https://*.stripe.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
        https://*.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:
        res.cloudinary.com
        fakestoreapi.com;
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
    ]
  },
};

module.exports = nextConfig;
