import { useLayoutEffect, useState } from "react";
import { onSnapshot, } from "firebase/firestore";
import { productQuery } from "@/db/dbRef";
import { z } from "zod";

const itemApi = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number()
});

const useGetItemsFromFirebase = () => {
  const [items, setItems] = useState<unknown>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    let isMounted = true;
    setLoading(true);
    const unsubscribeProductObserver = onSnapshot(productQuery(),
      (snaps) => {
        if (!isMounted) {
          return;
        }
        const items = snaps.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        try {
          items.forEach(item => {
            return itemApi.parse(item)
          })
        } catch (e) {
          alert("Lỗi lấy sản phẩm");
        }
        setItems(items);
        setLoading(false);
      },
      (error) => {
        alert("Lỗi lấy sản phẩm:" + error.message);
        setLoading(false);
      }
    );
    return () => {
      isMounted = false;
      unsubscribeProductObserver();
    };
  }, []);
  return {items, itemsLoading: loading};
};

export default useGetItemsFromFirebase;
