import type { NextApiRequest, NextApiResponse } from 'next';
import { getStripe } from '@/lib/stripe-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const paymentMethodID = req.body.paymentMethodID;
    const stripe = getStripe();
    const paymentMethodResult = await stripe.paymentMethods.detach(
      paymentMethodID
    );
    return res.status(200).json({ paymentMethod: paymentMethodResult });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(200).json({ error: message });
  }
}
