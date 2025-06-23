import React, {useCallback, useContext} from "react";
import {useCheckFirebaseIdTokenAuthTime} from "@/hooks/useCheckFirebaseIdTokenAuthTime";
import {useDispatch} from "react-redux";
import {resetCart} from "@/redux/cartSlice";
import useGetUserByObserver from "@/hooks/useGetUserByObserver";
import useCheckPhotoURL from "@/hooks/useCheckPhotoURL";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "@/configs/firebase";

const UserContext = React.createContext();
export const useUserContext = () => {
  return useContext(UserContext);
};

const UserProvider = ({children}) => {
  const router = useRouter()
  const {user, userLoading} = useGetUserByObserver();
  const {checkingPhotoURL, isPhotoExist, setIsPhotoExist} =
    useCheckPhotoURL(user);
  const dispatch = useDispatch();
  const signOut = useCallback(async () => {
    dispatch(resetCart());
    await auth.signOut();
    router.replace('/')
  }, [dispatch, user]);

  useCheckFirebaseIdTokenAuthTime(user, signOut);

  const signIn = ({email, password}) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = ({email, password}) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const value = {
    user,
    userLoading,
    checkingPhotoURL,
    isPhotoExist,
    setIsPhotoExist,
    signIn,
    signOut,
    register,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
