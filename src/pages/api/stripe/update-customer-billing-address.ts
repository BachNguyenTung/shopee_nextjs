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
    const {
      customerID,
      userName,
      shipName,
      phone,
      province,
      district,
      street,
      ward,
    } = req.body;
    const stripe = getStripe();
    const customerResult = await stripe.customers.update(customerID, {
      name: userName,
      address: {
        state: province,
        city: district,
        line1: ward,
        line2: street,
        postal_code: '10000',
        country: 'VN',
      },
      shipping: {
        name: shipName,
        phone: phone,
        address: {
          state: province,
          city: district,
          line1: ward,
          line2: street,
          postal_code: '10000',
          country: 'VN',
        },
      },
    });
    return res.status(200).json({ succeeded: true, customer: customerResult });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(200).json({ error: message });
  }
}
