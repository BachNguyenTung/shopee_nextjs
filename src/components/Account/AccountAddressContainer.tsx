import { useUser } from "@/context/UserProvider";
import AccountLeftMenu from "@/components/Account/AccountLeftMenu";
import AccountAddress from "@/components/Account/AccountAddress";
import React from "react";
import withContainer from "@/components/withContainer";
import { useMediaQuery } from "@mui/material";

const AccountAddressContainer = () => {
  const {user} = useUser();
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");

  return (
    <div className="main">
      {!xsBreakpointMatches &&
        <AccountLeftMenu user={user} />
      }
      <div className="user-content">
        <AccountAddress/>
      </div>
    </div>
  )
}

export default withContainer(AccountAddressContainer, true);

