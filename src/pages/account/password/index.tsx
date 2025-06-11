import React, { ReactElement } from "react";
import Layout from "@/components/Layout/Layout";
import AccountPasswordContainer from "@/components/Account/AccountPasswordContainer";
import AccountLayout from "@/components/Layout/AccountLayout";

export default function Password() {
  return <AccountPasswordContainer />
}

Password.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>
    <AccountLayout>
      {page}
    </AccountLayout>
  </Layout>
}
