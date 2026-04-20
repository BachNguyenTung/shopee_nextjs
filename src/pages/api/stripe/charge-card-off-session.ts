import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let total: string | string[] | undefined;
  try {
    total = req.query.total;
    const { paymentMethodID, customerID, email, shipping, orderItems, userId } =
      req.body;

    const orderId = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}`;

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(total),
      currency: 'vnd',
      shipping: shipping,
      payment_method: paymentMethodID,
      customer: customerID,
      receipt_email: email,
      off_session: true,
      confirm: true,
      metadata: {
        order_id: orderId,
        user_id: String(userId || customerID),
        items_count: String(orderItems ? orderItems.length : 0),
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntent: paymentIntent,
      orderId: orderId,
      status: paymentIntent.status,
    });
  } catch (error: unknown) {
    if (error instanceof Stripe.errors.StripeError) {
      if (error.code === 'authentication_required') {
        return res.status(200).json({
          error: 'authentication_required',
          paymentMethod: error.payment_method?.id,
          clientSecret: error.payment_intent?.client_secret,
          paymentIntentID: error.payment_intent?.id,
          amount: total,
          card: {
            brand: error.payment_method?.card?.brand,
            last4: error.payment_method?.card?.last4,
          },
        });
      }

      if (error.code) {
        return res.status(200).json({
          error: error.code,
          clientSecret: error.payment_intent?.client_secret,
          card: {
            brand: error.payment_method?.card?.brand,
            last4: error.payment_method?.card?.last4,
          },
        });
      }
    }

    console.log('Unknown error occurred', error);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
}
