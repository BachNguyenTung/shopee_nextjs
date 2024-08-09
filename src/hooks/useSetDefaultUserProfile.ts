import { useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { infoDocRef } from "@/db/dbRef";
import firebase from "firebase/compat";
import { State } from "@/pages/account/profile/_component/AccountProfile";

export default function useSetDefaultUserProfile({
                                                   user,
                                                   handleChange
                                                 }: {
  user: firebase.User | null
  handleChange: <K extends keyof State>(field: K, value: State[K]) => void
}) {
  useEffect(() => {
    if (user) {
      const userName = user.displayName;
      const email = user.email;
      handleChange('userName', userName ?? '')
      handleChange('email', email ?? '')
      handleChange('previewImage', user?.photoURL ?? '')

      getDoc(infoDocRef(user.uid))
        .then((doc) => {
          handleChange('name', doc?.data()?.name ?? '')
          handleChange('gender', doc?.data()?.gender ?? '')
          handleChange('birthday', doc?.data()?.birthday ?? '')
          handleChange('phone', doc?.data()?.phone ?? '')
        })
        .catch((err) => alert(err.message));
    }
  }, [user]); // rerender if upload success

}
