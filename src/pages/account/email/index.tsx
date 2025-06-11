import React, { ReactElement } from "react";
import Layout from "@/components/Layout/Layout";
import AccountEmailContainer from "@/components/Account/AccountEmailContainer";
import AccountLayout from "@/components/Layout/AccountLayout";

export default function Email() {
  return <AccountEmailContainer />
}

Email.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>
    <AccountLayout>
      {page}
    </AccountLayout>
  </Layout>
}

