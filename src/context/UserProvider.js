import React, {useCallback, useContext} from "react";
import {useDispatch} from "react-redux";
import {resetCart} from "@/redux/cartSlice";
import useGetUserByObserver from "@/hooks/useGetUserByObserver";
import useCheckPhotoURL from "@/hooks/useCheckPhotoURL";
import {useRouter} from "next/router";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "@/configs/firebase";

const UserContext = React.createContext();
export const useUserContext = () => {
  return useContext(UserContext);
};

// Helper to prepend API base URL if set
const getApiUrl = (path) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (base) {
    // Remove trailing slash from base and leading slash from path
    return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
  }
  return path;
};

const UserProvider = ({ children }) => {
  const router = useRouter()
  const { user, userLoading } = useGetUserByObserver();
  const { checkingPhotoURL, isPhotoExist, setIsPhotoExist } =
    useCheckPhotoURL(user);
  const dispatch = useDispatch();
  const signOut = useCallback(async () => {
    dispatch(resetCart());
    await auth.signOut();
    const response = await fetch('/api/session-logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    router.replace('/')
  }, [dispatch, user]);

  const signIn = async ({ email, password }) => {
    try {
      // 1. Get CSRF token from server
      const csrfResponse = await fetch('/api/csrf-token')
      const csrfToken = await csrfResponse.json();
      // 2. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      // 3. Create session with CSRF protection
      const response = await fetch('/api/session-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, csrfToken }),
        credentials: 'include',
      });
    } catch (e) {
      console.log(e)
    }

  };

  const register = ({ email, password }) => {
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
