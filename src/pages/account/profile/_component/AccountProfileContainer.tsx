import React from "react";
import AccountLeftMenu from "@/components/Account/AccountLeftMenu";
import AccountProfile from "@/pages/account/profile/_component/AccountProfile";
import withContainer from "@/components/withContainer";
import { useMediaQuery } from "@mui/material";

const AccountProfileContainer = () => {
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");
  return (
    <div className="main">
      {!xsBreakpointMatches &&
        <AccountLeftMenu />
      }
      <div className="user-content">
        <AccountProfile />
      </div>
    </div>
  )
}

export default withContainer(AccountProfileContainer, true);
