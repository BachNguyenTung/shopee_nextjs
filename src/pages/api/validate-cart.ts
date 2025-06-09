import type { NextApiRequest, NextApiResponse } from 'next';
import { getDoc } from 'firebase/firestore';
import { productDocRef } from '@/db/dbRef';

type ValidationResponse = {
  isValid: boolean;
  validatedItems?: any[];
  errors?: any[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      isValid: false,
      errors: ['Method not allowed']
    });
  }

  try {
    // Parse the request body to get cart items
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        isValid: false,
        errors: ['Empty or invalid cart']
      });
    }

    const validationErrors: any[] = [];
    const validatedItems: any[] = [];

    // Process each cart item in parallel
    const validationPromises = cartItems.map(async (item) => {
      // Skip items without ID
      if (!item.id) {
        validationErrors.push({
          itemId: item.id || 'unknown',
          message: 'Invalid item ID'
        });
        return;
      }

      try {
        // Fetch the latest product data from Firestore
        const productSnapshot = await getDoc(productDocRef(item.id));

        if (!productSnapshot.exists()) {
          validationErrors.push({
            itemId: item.id,
            message: 'Product no longer exists'
          });
          return;
        }

        const productData = productSnapshot.data();

        // Check if price has changed
        if (productData.price !== item.price) {
          validationErrors.push({
            itemId: item.id,
            name: item.name || productData.name,
            message: 'Price has changed',
            oldPrice: item.price,
            newPrice: productData.price
          });
        }

        // Add validated item with updated details
        validatedItems.push({
          ...item,
          currentPrice: productData.price,
        });
      } catch (error) {
        console.error('Error validating item', item.id, error);
        validationErrors.push({
          itemId: item.id,
          message: 'Error validating item'
        });
      }
    });

    // Wait for all validation promises to complete
    await Promise.all(validationPromises);

    // Return validation results
    return res.status(200).json({
      isValid: validationErrors.length === 0,
      validatedItems,
      errors: validationErrors.length > 0 ? validationErrors : null
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    console.log(error);
    return res.status(500).json({
      isValid: false,
      errors: ['Server error during cart validation']
    });
  }
}