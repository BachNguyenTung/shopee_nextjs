import { useUser } from "@/context/UserProvider";
import { useMediaQuery } from "@mui/material";
import AccountLeftMenu from "@/components/Account/AccountLeftMenu";
import AccountOrder from "@/components/Account/AccountOrder";
import React from "react";
import withContainer from "@/components/withContainer";

const AccountPurchaseContainer = () => {
  const {user} = useUser();
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");

  return (
    <div className="main">
      {!xsBreakpointMatches &&
        <AccountLeftMenu user={user} />
      }
      <div className="user-content">
        <AccountOrder/>
      </div>
    </div>
  )
}
export default withContainer(AccountPurchaseContainer, true)
