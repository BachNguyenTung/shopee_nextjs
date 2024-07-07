import { useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { infoDocRef } from "@/common/dbRef";
import firebase from "firebase/compat";

export default function useSetDefaultUserProfile({
                                                   user,
                                                   setUserName,
                                                   setEmail,
                                                   setPreviewImage,
                                                   setName,
                                                   setGender,
                                                   setBirthday,
                                                   setPhone,
                                                 }: {
  user: firebase.User | null
  setUserName: React.Dispatch<React.SetStateAction<string>>
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>
  setName: React.Dispatch<React.SetStateAction<string>>
  setGender: React.Dispatch<React.SetStateAction<string>>
  setBirthday: React.Dispatch<React.SetStateAction<string>>
  setPhone: React.Dispatch<React.SetStateAction<string>>
}) {
  useEffect(() => {
    if (user) {
      const userName = user.displayName;
      const email = user.email;
      setUserName(userName ? userName : "");
      setEmail(email ? email : "");
      setPreviewImage(user?.photoURL ?? '');

      getDoc(infoDocRef(user.uid))
        .then((doc) => {
          setName(doc?.data()?.name ? doc?.data()?.name : "");
          setGender(doc?.data()?.gender ? doc?.data()?.gender : "");
          setBirthday(doc?.data()?.birthday ? doc?.data()?.birthday : "");
          setPhone(doc?.data()?.phone ? doc?.data()?.phone : "");
        })
        .catch((err) => alert(err.message));
    }
  }, [user]); // rerender if upload success

}
