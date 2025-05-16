import { useEffect, useTransition } from "react";
import { onSnapshot } from "firebase/firestore";
import { productQuery } from "@/db/dbRef";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

const itemApi = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
});

const useGetItemsFromFirebase = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Delay subscription until after hydration
    const timeoutId = setTimeout(() => {
      let isMounted = true;
      const unsubscribeProductObserver = onSnapshot(productQuery(),
        (snaps) => {
          if (!isMounted) return;

          const items = snaps.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          try {
            items.forEach(item => itemApi.parse(item));

            // Use startTransition to avoid interrupting hydration
            startTransition(async () => {
              await queryClient.setQueryData(['products'], items);
            })
          } catch (e) {
            console.error("Error parsing products:", e);
          }
        },
        (error) => {
          console.error("Error fetching products:", error);
        }
      );

      return () => {
        isMounted = false;
        unsubscribeProductObserver();
      };
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [queryClient, startTransition]);
};

export default useGetItemsFromFirebase;
