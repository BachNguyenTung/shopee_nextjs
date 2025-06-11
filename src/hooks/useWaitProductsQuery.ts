import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";

export const useWaitProductsQuery = () => {
  const { data, isPending } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return { data, isPending };
}
