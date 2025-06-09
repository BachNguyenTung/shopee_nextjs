import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/fetchProducts";

export const useProductsQuery = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: Infinity,
  });

  return { data };
}
