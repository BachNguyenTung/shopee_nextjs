/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
const functions = require("firebase-functions");

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://shopee-demo-c6d2b-default-rtdb.asia-southeast1.firebasedatabase.app",
});

// Get configuration from Firebase
const config = functions.config();
const stripeConfig = config.stripe || {};
const stripeSecretKey = stripeConfig.secret_key || process.env.REACT_APP_STRIPE_SECRET_KEY_TEST;
const stripeWebhookSecret = stripeConfig.webhook_secret;

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(stripeSecretKey);
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

// API

// App configuration
const app = express();

// Middleware configuration
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigin = isProduction ? ['http://localhost:3000', 'https://shopee-nextjs-ecru.vercel.app'] : true; // <-- CHANGE to your frontend domain in prod

app.use(cors({
  origin: allowedOrigin, // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'stripe-signature'
  ],
  credentials: true
}));
// Add cookie parser middleware after CORS
app.use(cookieParser());

// Special handling for Stripe webhook - must come BEFORE any other middleware
app.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    // Immediately send a 200 response to acknowledge receipt before processing
    // This prevents timeouts from Stripe's perspective
    response.status(200).send({ received: true });

    const sig = request.headers['stripe-signature'];
    const endpointSecret = stripeWebhookSecret;

    if (!endpointSecret) {
      console.error('Webhook Error: Missing Stripe webhook secret');
      return; // Already sent response above
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return; // Already sent response above
    }

    // Handle the event asynchronously (response already sent)
    try {
      switch (event.type) {
        // Payment intent events
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object);
          break;

        // Setup intent events
        case 'setup_intent.succeeded':
          console.log('SetupIntent was successful!');
          break;

        case 'setup_intent.setup_failed':
          console.log('SetupIntent failed');
          break;

        // Customer events
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          console.log(`Subscription status: ${subscription.status}`);
          break;

        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.error(`Error processing webhook event ${event.type}:`, error);
      // No need to send response, already sent
    }
  }
);

// Regular JSON parsing for other routes - place AFTER the webhook route
app.use(express.json());

// API routes

app.post("/retrieve-customer-by-id", async (req, res) => {
  try {
    const customerID = req.body.customerID;
    // retrieve customer object
    const customerResult = await stripe.customers.retrieve(customerID);

    res.send({customer: customerResult});
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
});

app.post("/get-payment-method-list", async (req, res) => {
  try {
    const customerID = req.body.customerID;
    // List the customer's payment methods to find one to charge
    const paymentMethodListResult = await stripe.paymentMethods.list({
      customer: customerID,
      type: "card",
    });
    res.send({
      paymentMethodList: paymentMethodListResult.data,
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      error: error.message,
    });
  }
});

app.post("/create-token-server-side", async (request, response) => {
  try {
    const tokenClientSideID = request.body.tokenClientSideID;
    const tokenResult = await stripe.tokens.retrieve(tokenClientSideID);
    response.send({
      tokenResult: tokenResult,
    });
  } catch (error) {
    response.send({
      error: error.message,
    });
  }
});

// Create setup Intent => return client secret
app.post("/create-setup-intent", async (request, response) => {
  // Since we are using test cards, create a new Customer here
  // You would do this in your payment flow that saves cards
  try {
    const name = request.body.name;
    const email = request.body.email;
    const customerID = request.body.customerID;
    let customer;
    if (!customerID) {
      customer = await stripe.customers.create({
        name: name,
        email: email,
      });
    }
    const intent = await stripe.setupIntents.create({
      customer: customerID ? customerID : customer.id,
    });

    response.status(201).send({
      setUpIntentSecret: intent.client_secret,
      customerID: intent.customer,
    });
  } catch (error) {
    response.send({
      error: error.message,
    });
  }
});

app.post("/detach-payment-method", async (req, res) => {
  try {
    const paymentMethodID = req.body.paymentMethodID;
    const paymentMethodResult = await stripe.paymentMethods.detach(
      paymentMethodID
    );
    res.send({
      paymentMethod: paymentMethodResult,
    });
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
});

app.post("/update-customer-payment-method", async (req, res) => {
  try {
    const customerID = req.body.customerID;
    const paymentMethodID = req.body.paymentMethodID;
    const customerResult = await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: paymentMethodID,
      },
    });
    res.send({customer: customerResult});
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
});

app.post("/update-customer-billing-address", async (request, response) => {
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
    } = request.body;
    const customerResult = await stripe.customers.update(customerID, {
      name: userName,
      address: {
        state: province,
        city: district,
        line1: ward,
        line2: street,
        postal_code: 10000,
        country: "VN",
      },
      shipping: {
        name: shipName,
        phone: phone,
        address: {
          state: province,
          city: district,
          line1: ward,
          line2: street,
          postal_code: 10000,
          country: "VN",
        },
      },
    });
    response.send({succeeded: true, customer: customerResult});
  } catch (error) {
    response.send({
      error: error.message,
    });
  }
});

// Charge by creating payment Intent
app.post("/charge-card-off-session", async (request, response) => {
  let total;
  try {
    total = request.query.total;
    const { paymentMethodID, customerID, email, shipping, orderItems } = request.body;

    // Create a unique order ID that will be tracked through the webhook
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "vnd",
      shipping: shipping,
      payment_method: paymentMethodID,
      customer: customerID,
      receipt_email: email,
      off_session: true,
      confirm: true,
      metadata: {
        order_id: orderId,
        user_id: request.body.userId || customerID,
        items_count: orderItems ? orderItems.length : 0,
      }
    });

    // Return the PaymentIntent details without handling success logic here
    // The webhook will handle the actual success/failure processing
    response.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntent: paymentIntent,
      // Include orderId so the client has a reference
      orderId: orderId,
      // Still include payment status so client can show immediate feedback
      status: paymentIntent.status
    });
  } catch (error) {
    if (error.code === "authentication_required") {
      // Authentication required case still needs client-side handling
      response.send({
        error: "authentication_required",
        paymentMethod: error.raw.payment_method.id,
        clientSecret: error.raw.payment_intent.client_secret,
        paymentIntentID: error.raw.payment_intent.id,
        amount: total,
        card: {
          brand: error.raw.payment_method.card.brand,
          last4: error.raw.payment_method.card.last4,
        },
      });
    } else if (error.code) {
      // Other declined cases
      response.send({
        error: error.code,
        clientSecret: error.raw.payment_intent.client_secret,
        card: {
          brand: error.raw.payment_method.card.brand,
          last4: error.raw.payment_method.card.last4,
        },
      });
    } else {
      console.log("Unknown error occurred", error);
      response.status(500).send({ error: "Payment processing failed" });
    }
  }
});

// Helper function to handle successful payments
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

  try {
    // Extract metadata from the payment intent
    const { order_id, user_id, items_count } = paymentIntent.metadata;

    if (user_id && order_id) {
      // Get the customer details for shipping information
      const customer = await stripe.customers.retrieve(paymentIntent.customer);

      // 1. Create/update the order in Firestore
      const orderRef = admin.firestore().collection('users').doc(user_id)
        .collection('orders').doc(order_id);

      // Get the current cart items for this user to update inventory
      const checkoutRef = admin.firestore().collection('users').doc(user_id)
        .collection('checkout').doc('current');

      // Run as a transaction to ensure data consistency
      await admin.firestore().runTransaction(async (transaction) => {
        const checkoutDoc = await transaction.get(checkoutRef);

        if (checkoutDoc.exists) {
          const checkoutData = checkoutDoc.data();
          const items = checkoutData.basket || [];

          // Update the order with payment info
          transaction.set(orderRef, {
            basket: items,
            amount: paymentIntent.amount,
            payment_status: 'succeeded',
            payment_id: paymentIntent.id,
            payment_method: paymentIntent.payment_method,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
            shipping: paymentIntent.shipping
          }, { merge: true });

          // 2. Update product inventory (sold amount)
          if (items && items.length > 0) {
            for (const item of items) {
              const productRef = admin.firestore().collection('products').doc(item.id);
              const productDoc = await transaction.get(productRef);

              if (productDoc.exists) {
                const productData = productDoc.data();
                const updatedSoldAmount = (productData.soldAmount || 0) + Number(item.amount);

                transaction.update(productRef, {
                  soldAmount: updatedSoldAmount
                });
              }
            }
          }

          // 3. Clear the user's cart
          transaction.set(checkoutRef, {
            basket: [],
            updated_at: admin.firestore.FieldValue.serverTimestamp()
          });

          // Also clear their cart in a separate collection if you have one
          const cartRef = admin.firestore().collection('users').doc(user_id)
            .collection('cart').doc('current');
          transaction.set(cartRef, {
            products: [],
            updated_at: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      });

      console.log(`Order ${order_id} processed successfully`);
    }
  } catch (error) {
    console.error('Error processing payment success webhook:', error);
    throw error; // Propagate the error to trigger 500 response
  }
}

// Helper function to handle failed payments
async function handlePaymentIntentFailed(failedPaymentIntent) {
  console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message}`);

  try {
    // Extract metadata from the payment intent
    const { order_id, user_id } = failedPaymentIntent.metadata;

    if (user_id && order_id) {
      // Create or update order with failed status
      const orderRef = admin.firestore().collection('users').doc(user_id)
        .collection('orders').doc(order_id);

      // Get any information we might need from checkout
      const checkoutRef = admin.firestore().collection('users').doc(user_id)
        .collection('checkout').doc('current');

      const checkoutDoc = await checkoutRef.get();
      const items = checkoutDoc.exists ? checkoutDoc.data().basket || [] : [];

      // Update order with failure information
      await orderRef.set({
        basket: items,
        amount: failedPaymentIntent.amount,
        payment_status: 'failed',
        payment_id: failedPaymentIntent.id,
        failure_reason: failedPaymentIntent.last_payment_error?.message || 'Unknown error',
        failure_code: failedPaymentIntent.last_payment_error?.code,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`Order ${order_id} updated with payment status: failed`);
    }
  } catch (error) {
    console.error('Error processing payment failure webhook:', error);
    throw error; // Propagate the error
  }
}

// Listen command
const region = 'asia-east1';
exports.api = functions.region(region).https.onRequest(app);
