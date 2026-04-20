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
    const tokenClientSideID = req.body.tokenClientSideID;
    const stripe = getStripe();
    const tokenResult = await stripe.tokens.retrieve(tokenClientSideID);
    return res.status(200).json({ tokenResult });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(200).json({ error: message });
  }
}
