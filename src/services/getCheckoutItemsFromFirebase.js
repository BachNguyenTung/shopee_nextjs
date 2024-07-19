import {checkoutDocRef} from "@/db/dbRef";
import {getDoc} from "firebase/firestore";

export const getCheckoutItemsFromFirebase = (user) => {
  return user?.uid ? getDoc(checkoutDocRef(user.uid)) : Promise.reject('no user');
};
