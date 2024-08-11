import { useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { infoDocRef } from "@/db/dbRef";
import { useUserContext } from "@/context/UserProvider";
import { AccountProfileState } from "@/hooks/useAccountProfileState";

export default function useSetDefaultUserProfile({
                                                   handleChange
                                                 }: {
  handleChange?: <K extends keyof AccountProfileState>(field: K, value: AccountProfileState[K]) => void
}) {
  const { user } = useUserContext()
  useEffect(() => {
    if (user) {
      const userName = user.displayName;
      const email = user.email;
      handleChange?.('userName', userName ?? '')
      handleChange?.('email', email ?? '')
      handleChange?.('previewImage', user?.photoURL ?? '')

      getDoc(infoDocRef(user.uid))
        .then((doc) => {
          handleChange?.('name', doc?.data()?.name ?? '')
          handleChange?.('gender', doc?.data()?.gender ?? '')
          handleChange?.('birthday', doc?.data()?.birthday ?? '')
          handleChange?.('phone', doc?.data()?.phone ?? '')
        })
        .catch((err) => alert(err.message));
    }
  }, [user]); // rerender if upload success

}
