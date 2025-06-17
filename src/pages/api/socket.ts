import { NextApiRequest, NextApiResponse } from 'next';
import { pusher } from '@/configs/pusher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Socket API called:', {
    method: req.method,
    body: req.body,
    pusherConfig: {
      appId: process.env.PUSHER_APP_ID ? 'Set' : 'Not set',
      key: process.env.PUSHER_KEY ? 'Set' : 'Not set',
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ? 'Set' : 'Not set'
    }
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId, newPrice } = req.body;

    // Validate required fields
    if (!productId || typeof newPrice !== 'number') {
      return res.status(400).json({
        message: 'Invalid request body. Required: productId (string) and newPrice (number)'
      });
    }

    await pusher.trigger('price-updates', 'product-price-updated', {
      productId,
      newPrice,
    });

    console.log('Price update broadcasted:', { productId, newPrice });
    res.status(200).json({ message: 'Price update broadcasted successfully' });
  } catch (error) {
    console.error('Pusher error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      message: 'Error broadcasting price update',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}
