import { Elements } from "@stripe/react-stripe-js";
import AccountPayment from "@/components/Account/AccountPayment";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ?? '');
const AccountPaymentContainer = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST) console.error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST environment variable is not set')

  return (
    <div className="user-content">
      <Elements stripe={stripePromise}>
        <AccountPayment />
      </Elements>
    </div>
  )
}
export default AccountPaymentContainer
