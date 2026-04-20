import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/configs/firebase-admin';
import type Stripe from 'stripe';

export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

  const { order_id, user_id } = paymentIntent.metadata;

  if (!user_id || !order_id) {
    return;
  }

  const orderRef = adminDb
    .collection('users')
    .doc(user_id)
    .collection('orders')
    .doc(order_id);

  const checkoutRef = adminDb
    .collection('users')
    .doc(user_id)
    .collection('checkout')
    .doc('current');

  await adminDb.runTransaction(async (transaction) => {
    const checkoutDoc = await transaction.get(checkoutRef);

    if (!checkoutDoc.exists) {
      return;
    }

    const checkoutData = checkoutDoc.data();
    const items = checkoutData?.basket || [];

    transaction.set(
      orderRef,
      {
        basket: items,
        amount: paymentIntent.amount,
        payment_status: 'succeeded',
        payment_id: paymentIntent.id,
        payment_method: paymentIntent.payment_method,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        shipping: paymentIntent.shipping,
      },
      { merge: true }
    );

    if (items.length > 0) {
      for (const item of items) {
        const productRef = adminDb.collection('products').doc(item.id);
        const productDoc = await transaction.get(productRef);

        if (productDoc.exists) {
          const productData = productDoc.data();
          const updatedSoldAmount =
            (productData?.soldAmount || 0) + Number(item.amount);

          transaction.update(productRef, {
            soldAmount: updatedSoldAmount,
          });
        }
      }
    }

    transaction.set(checkoutRef, {
      basket: [],
      updated_at: FieldValue.serverTimestamp(),
    });

    const cartRef = adminDb
      .collection('users')
      .doc(user_id)
      .collection('cart')
      .doc('current');
    transaction.set(cartRef, {
      products: [],
      updated_at: FieldValue.serverTimestamp(),
    });
  });

  console.log(`Order ${order_id} processed successfully`);
}

export async function handlePaymentIntentFailed(
  failedPaymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log(
    `Payment failed: ${failedPaymentIntent.last_payment_error?.message}`
  );

  const { order_id, user_id } = failedPaymentIntent.metadata;

  if (!user_id || !order_id) {
    return;
  }

  const orderRef = adminDb
    .collection('users')
    .doc(user_id)
    .collection('orders')
    .doc(order_id);

  const checkoutRef = adminDb
    .collection('users')
    .doc(user_id)
    .collection('checkout')
    .doc('current');

  const checkoutDoc = await checkoutRef.get();
  const items = checkoutDoc.exists ? checkoutDoc.data()?.basket || [] : [];

  await orderRef.set(
    {
      basket: items,
      amount: failedPaymentIntent.amount,
      payment_status: 'failed',
      payment_id: failedPaymentIntent.id,
      failure_reason:
        failedPaymentIntent.last_payment_error?.message || 'Unknown error',
      failure_code: failedPaymentIntent.last_payment_error?.code,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`Order ${order_id} updated with payment status: failed`);
}
