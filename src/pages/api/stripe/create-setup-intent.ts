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
    const { name, email, customerID } = req.body;
    const stripe = getStripe();
    let customer: { id: string } | undefined;
    if (!customerID) {
      customer = await stripe.customers.create({
        name,
        email,
      });
    }
    const intent = await stripe.setupIntents.create({
      customer: customerID ? customerID : customer!.id,
    });

    return res.status(201).json({
      setUpIntentSecret: intent.client_secret,
      customerID: intent.customer,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(200).json({ error: message });
  }
}
