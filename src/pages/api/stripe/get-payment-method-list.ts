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
    const customerID = req.body.customerID;
    const stripe = getStripe();
    const paymentMethodListResult = await stripe.paymentMethods.list({
      customer: customerID,
      type: 'card',
    });
    return res.status(200).json({
      paymentMethodList: paymentMethodListResult.data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(message);
    return res.status(200).json({ error: message });
  }
}
