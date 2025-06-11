import { useUserContext } from "@/context/UserProvider";
import React, { useEffect, useState } from "react";
import AccountPassword from "@/components/Account/AccountPassword";

const AccountPasswordContainer = () => {
  const { user } = useUserContext();
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    if (user) {
      const email = user.email;
      setEmail(email ? email : "");
    }
  }, [user])
  return (
    <div className="user-content">
      <AccountPassword email={email} setEmail={setEmail} />
    </div>
  )
}

export default AccountPasswordContainer
