import { useEffect, useState } from "react";
import { auth } from "@/configs/firebase";
import { signOut, User } from "@firebase/auth";

const useGetUserByObserver = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const refresh = async (user: User) => {
      try {
        const idToken = await user.getIdToken(true);

        // 1. Get CSRF token from server
        const csrfResponse = await fetch('/api/csrf-token')
        const csrfToken = await csrfResponse.json();

        const response = await fetch('/api/session-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken, csrfToken }),
          credentials: 'include',
        });
        if (!response.ok) {
          console.warn("Session refresh failed. Redirecting to login.");

        }
      } catch (error) {
        await signOut(auth);
        console.warn("Error refreshing session (USEEFFECT):", error);
      }
    };

    const unsubscribeUserObserver = auth.onIdTokenChanged(
      async (authUser) => {
        if (!isMounted) {
          return;
        }
        if (authUser) {
          //user will log in or logged in
          // authUser.updateProfile({ photoURL: null }).then(() => {
          // });
          setUser(authUser);
          await refresh(authUser)
          // cartItems = this.getCartItemsFromFirebase(authUser);
        } else {
          //user logged out
          console.log("No user logged in. Skipping session refresh.");
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        alert("Lỗi check user:" + error);
        setLoading(false);
      }
    );
    return () => {
      isMounted = false;
      unsubscribeUserObserver();
    };
  }, []);

  return { user, userLoading: loading };
};
export default useGetUserByObserver;
