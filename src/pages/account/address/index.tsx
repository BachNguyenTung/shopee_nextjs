import React, { ReactElement } from "react";
import Layout from "@/components/Layout/Layout";
import AccountAddressContainer from "@/components/Account/AccountAddressContainer";
import AccountLayout from "@/components/Layout/AccountLayout";

export default function Address() {
  return <AccountAddressContainer />
}

Address.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>
    <AccountLayout>
      {page}
    </AccountLayout>
  </Layout>
}
