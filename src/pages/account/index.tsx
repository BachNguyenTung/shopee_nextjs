import { useRouter } from 'next/navigation'
import React, { ReactElement, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ClipLoading } from "@/components/ClipLoading";
import AccountLayout from "@/components/Layout/AccountLayout";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ?? '');

export default function Account() {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST) console.error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST environment variable is not set')
  const router = useRouter();
  useEffect(() => {
    router.replace("/account/profile")
  }, [])
  return <ClipLoading />
}

Account.getLayout = function (page: ReactElement) {
  return (
    <Elements stripe={stripePromise}>
      <Layout isAccountPage={true}>
        <AccountLayout>
          {page}
        </AccountLayout>
      </Layout>
    </Elements>
  )
}
