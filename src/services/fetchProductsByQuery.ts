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

      // Use Firestore's where clause for more efficient querying
      const snapshot = await adminDb
        .collection('products')
        .where('name', '>=', trimmedQuery)
        .get();

      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return products;
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
