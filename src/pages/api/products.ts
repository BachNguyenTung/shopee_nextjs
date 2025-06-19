import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/configs/firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const snapshot = await adminDb.collection('products').get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Set balanced caching headers for Vercel Edge Network
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('CDN-Cache-Control', 'max-age=300');
    res.setHeader('Vercel-CDN-Cache-Control', 'max-age=300');
    res.setHeader('Vary', 'Accept-Encoding');

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products' });
  }
}
