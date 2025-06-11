import { useUserContext } from "@/context/UserProvider";
import React, { useEffect, useState } from "react";
import AccountEmail from "@/components/Account/AccountEmail";
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
    <div className="user-content">
      <AccountEmail email={email} setEmail={setEmail} />
    </div>
  )
}
export default AccountEmailContainer
