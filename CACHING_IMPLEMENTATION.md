# Vercel Edge Network Caching Implementation

This document explains the comprehensive caching implementation for Vercel's Edge Network in this Next.js application.

## Overview

The caching implementation uses both `vercel.json` and `next.config.js` to configure caching headers for different types
of content, ensuring optimal performance and user experience.

## Caching Strategy

### 1. Static Assets (Long-term caching)

- **Files**: `/_next/static/*`, `/_next/image/*`, and general static files (JS, CSS, images, fonts)
- **Cache Duration**: 1 year (31536000 seconds)
- **Strategy**: `public, max-age=31536000, immutable`
- **Purpose**: These files rarely change and can be cached for extended periods

### 2. API Routes (Medium-term caching)

- **Files**: `/api/products`
- **Cache Duration**: 5 minutes (300 seconds)
- **Strategy**: `s-maxage=300, stale-while-revalidate=600`
- **Purpose**: Product data changes occasionally but benefits from caching

### 3. Search Pages (Short-term caching)

- **Files**: `/search`
- **Cache Duration**: 1 minute (60 seconds)
- **Strategy**: `s-maxage=60, stale-while-revalidate=300`
- **Purpose**: Search results can be cached briefly but need to stay relatively fresh

### 4. Static Files (Medium-term caching)

- **Files**: `/robots.txt`, `/api/sitemap.xml`, `/manifest.webmanifest`
- **Cache Duration**: 1 hour (3600 seconds)
- **Strategy**: `s-maxage=3600, stale-while-revalidate=7200`
- **Purpose**: These files change infrequently but should be updated periodically

## Cache Headers Explained

### Cache-Control

- `s-maxage`: Server-side cache duration (Vercel Edge Network)
- `stale-while-revalidate`: Allows serving stale content while revalidating in background
- `max-age`: Browser cache duration
- `immutable`: Indicates the resource will never change

### CDN-Cache-Control & Vercel-CDN-Cache-Control

- Specific headers for Vercel's Edge Network
- Ensures proper caching behavior across Vercel's infrastructure

### Vary

- `Accept-Encoding`: Different cache entries for different compression types
- `Accept-Language`: Different cache entries for different language preferences

## Implementation Files

### 1. vercel.json

```json
{
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "CDN-Cache-Control",
          "value": "max-age=31536000"
        },
        {
          "key": "Vercel-CDN-Cache-Control",
          "value": "max-age=31536000"
        }
      ]
    }
    // ... more configurations
  ]
}
```

### 2. next.config.js

```javascript
async headers() {
  return [
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
    // ... more configurations
  ]
}
```

### 3. API Routes (src/pages/api/products.ts)

```typescript
// Set caching headers for Vercel Edge Network
res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
res.setHeader('CDN-Cache-Control', 'max-age=300');
res.setHeader('Vercel-CDN-Cache-Control', 'max-age=300');
res.setHeader('Vary', 'Accept-Encoding');
```

### 4. Pages with getServerSideProps (src/pages/search/index.tsx)

```typescript
// Set caching headers for Vercel Edge Network
if (context.res) {
  context.res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  context.res.setHeader('CDN-Cache-Control', 'max-age=60');
  context.res.setHeader('Vercel-CDN-Cache-Control', 'max-age=60');
  context.res.setHeader('Vary', 'Accept-Encoding, Accept-Language');
}
```

## Cache Invalidation

- **Automatic**: Cache is automatically purged upon new deployments
- **Manual**: Re-deploy to invalidate cache if needed
- **Regional**: Cache is segmented by region for optimal performance

## Monitoring Cache Performance

### Check Cache Status

Look for the `x-vercel-cache` header in responses:

- `HIT`: Response served from cache
- `MISS`: Response generated fresh
- `STALE`: Response served from stale cache while revalidating

### Cache Hit Rate

Monitor your Vercel dashboard for cache performance metrics and adjust cache durations based on:

- Content update frequency
- User traffic patterns
- Performance requirements

## Best Practices

1. **Use appropriate cache durations** based on content update frequency
2. **Implement stale-while-revalidate** for better user experience
3. **Use Vary headers** when content varies based on request headers
4. **Monitor cache performance** and adjust as needed
5. **Test cache behavior** in different regions

## Troubleshooting

### Cache Not Working

1. Check if response meets cacheable criteria
2. Verify headers are set correctly
3. Ensure no `no-cache` or `private` directives
4. Check response size (max 10MB for functions)

### Cache Too Aggressive

1. Reduce `s-maxage` values
2. Remove `stale-while-revalidate` if needed
3. Add cache-busting parameters

### Cache Not Aggressive Enough

1. Increase `s-maxage` values
2. Add `immutable` for static assets
3. Optimize content update frequency

## References

- [Vercel Edge Cache Documentation](https://vercel.com/docs/edge-cache?framework=nextjs#using-vercel-functions)
- [Cache-Control MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Vercel Headers Documentation](https://vercel.com/docs/projects/project-configuration#headers)
