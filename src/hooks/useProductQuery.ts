import { useQuery } from '@tanstack/react-query'
import { fetchProduct } from '@/services/fetchProductById'
import { Product } from "@/types/types";

export function useProductQuery(id: string | string[] | undefined) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id as string) as Promise<Product>,
    enabled: !!id
  })
}
