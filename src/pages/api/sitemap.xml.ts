import { NextApiRequest, NextApiResponse } from 'next'
import { fetchProducts } from '@/services/fetchProducts'

const BASE_URL = 'https://shopee-nextjs-ecru.vercel.app'

function generateSiteMap(products: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>${BASE_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${BASE_URL}/cart</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>${BASE_URL}/search</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>

      <!-- Dynamic product pages -->
      ${products
    .map((product) => {
      return `
            <url>
              <loc>${BASE_URL}/product/${product.id}</loc>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
              <lastmod>${new Date().toISOString()}</lastmod>
            </url>
          `
    })
    .join('')}
    </urlset>
  `
}

function SiteMap() {
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all products
    const products = await fetchProducts()

    // Generate sitemap XML
    const sitemap = generateSiteMap(products)

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600')

    // Send the XML to the browser
    res.write(sitemap)
    res.end()
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).json({ error: 'Error generating sitemap' })
  }
}

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
}
