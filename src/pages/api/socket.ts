import { NextApiRequest, NextApiResponse } from 'next';
import { pusher } from '@/configs/pusher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { productId, newPrice } = req.body;

    await pusher.trigger('price-updates', 'product-price-updated', {
      productId,
      newPrice,
    });

    res.status(200).json({ message: 'Price update broadcasted successfully' });
  } catch (error) {
    console.error('Pusher error:', error);
    res.status(500).json({ message: 'Error broadcasting price update' });
  }
}
