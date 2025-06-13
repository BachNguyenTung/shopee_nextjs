import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchProduct } from '@/services/fetchProductById'
import { Product } from "@/types/types";

export function useWaitProductQuery(id: string | undefined) {
  return useSuspenseQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => {
      if (!id) throw new Error('Product ID is required');
      return fetchProduct(id) as Promise<Product>;
    }
  })
}
