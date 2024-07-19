import {searchHistoryDocRef} from "@/db/dbRef";
import {getDoc} from "firebase/firestore";

const getSearchHistoryFromFirebase = async (user) => {
  if (!user) return;
  let searchHistory = [];
  try {
    const doc = await getDoc(searchHistoryDocRef(user?.uid));
    if (doc.exists) {
      searchHistory = doc.data().basket;
    }
  } catch (error) {
    alert(error.message);
  }
  return searchHistory;
};
export default getSearchHistoryFromFirebase;
