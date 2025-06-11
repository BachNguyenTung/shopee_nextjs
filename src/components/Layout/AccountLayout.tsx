import AccountLeftMenu from "@/components/Account/AccountLeftMenu";
import React from "react";
import { useMediaQuery } from "@mui/material";
import withContainer from "@/components/withContainer";

function AccountLayout({ children }: { children: React.ReactNode }) {
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");
  return (
    <div className="main">
      {!xsBreakpointMatches &&
        <AccountLeftMenu />
      }
      {children}
    </div>
  )
}

export default withContainer(AccountLayout, true)

