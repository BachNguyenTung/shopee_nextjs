import { useUserContext } from "@/context/UserProvider";
import AccountLeftMenu from "@/components/Account/AccountLeftMenu";
import { Elements } from "@stripe/react-stripe-js";
import AccountPayment from "@/components/Account/AccountPayment";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import withContainer from "@/components/withContainer";
import { useMediaQuery } from "@mui/material";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ?? '');
const AccountPaymentContainer = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST) console.error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST environment variable is not set')
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");

  const { user } = useUserContext();
  return (
    <div className="main">
      {!xsBreakpointMatches &&
        <AccountLeftMenu user={user} />
      }
      <div className="user-content">
        <Elements stripe={stripePromise}>
          <AccountPayment/>
        </Elements>
      </div>
    </div>
  )
}
export default withContainer(AccountPaymentContainer, true)
