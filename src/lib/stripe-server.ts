import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    const key =
      process.env.STRIPE_SECRET_KEY ||
      process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY_TEST;
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY (or NEXT_PUBLIC_STRIPE_SECRET_KEY_TEST)');
    }
    stripe = new Stripe(key, { apiVersion: '2022-08-01' });
  }
  return stripe;
}

export function getStripeWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET;
}
