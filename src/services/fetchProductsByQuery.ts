import { adminDb } from '@/configs/firebase-admin';

// Simple request memoization (deduplication)
const requestCache = new Map<string, Promise<any>>();

export const fetchProductsByQuery = async (query: string) => {
  const cacheKey = `products-query-${query.toLowerCase().trim()}`;

  // Check if there's already a pending request for this query
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  // Create the request promise
  const requestPromise = (async () => {
    try {
      const trimmedQuery = query.toLowerCase().trim();

      // Since Firestore doesn't support native "contains" queries,
      // we need to fetch all products and filter on the server side
      const snapshot = await adminDb
        .collection('products')
        .get();

      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter products that contain the query string in their name (case-insensitive)
      const filteredProducts = allProducts.filter((product: any) =>
        product.name.toLowerCase().includes(trimmedQuery)
      );

      return filteredProducts;
    } catch (error) {
      console.error('Error fetching products by query:', error);
      throw new Error('Failed to fetch products by query');
    } finally {
      // Clean up the cache after request completes
      requestCache.delete(cacheKey);
    }
  })();

  // Store the promise in cache
  requestCache.set(cacheKey, requestPromise);

  return requestPromise;
};
