import {useEffect, useState} from "react";
import {useUserContext} from "@/context/UserProvider";
import {saveSearchHistoryToFirebase} from "@/services/saveSearchHistoryToFirebase";
import getSearchHistoryFromFirebase from "@/services/getSearchHistoryFromFirebase";

const useSearchHistory = () => {
  const { user } = useUserContext();
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    (async () => {
      if (user) {
        const searchHistory = await getSearchHistoryFromFirebase(user);
        setSearchHistory(searchHistory);
      }
    })();
  }, [setSearchHistory, user]);

  const addToSearchHistory = (text) => {
    text = text.trim();
    if (text.length > 0) {
      const newSearchHistory = [...searchHistory, text];
      const uniqueNewSearchHistory = [...new Set(newSearchHistory)];
      saveSearchHistoryToFirebase(user, uniqueNewSearchHistory).then(() =>
        setSearchHistory(uniqueNewSearchHistory)
      );
    }
  };

  const deleteFromSearchHistory = (text) => {
    text = text.trim();
    if (text.length > 0) {
      const newSearchHistory = [...searchHistory].filter(
        (item) => item !== text
      );
      setSearchHistory(newSearchHistory);
      saveSearchHistoryToFirebase(user, newSearchHistory).then();
    }
  };

  return {
    searchHistory,
    addToSearchHistory,
    deleteFromSearchHistory,
  };
};

export default useSearchHistory;
