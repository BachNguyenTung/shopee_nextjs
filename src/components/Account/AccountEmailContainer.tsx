import { useUserContext } from "@/context/UserProvider";
import React, { useEffect, useState } from "react";
import AccountLeftMenu from "@/components/Account/AccountLeftMenu";
import AccountEmail from "@/components/Account/AccountEmail";
import withContainer from "@/components/withContainer";
import { useMediaQuery } from "@mui/material";

const AccountEmailContainer = () => {
  const { user } = useUserContext();
  const [email, setEmail] = useState<string>('')
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (user) {
      const email = user.email;
      setEmail(email ? email : "");
    }
  }, [user])
  return (
    <div className="main">
      {!xsBreakpointMatches &&
        <AccountLeftMenu user={user} />
      }
      <div className="user-content">
        <AccountEmail email={email} setEmail={setEmail}/>
      </div>
    </div>)
}
export default withContainer(AccountEmailContainer, true)
