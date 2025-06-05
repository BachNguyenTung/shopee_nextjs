import { NextResponse } from 'next/server';
import { getDoc } from 'firebase/firestore';
import { productDocRef } from '@/db/dbRef';

export async function POST(request: Request) {
  try {
    // Parse the request body to get cart items
    const { cartItems } = await request.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        {
          isValid: false,
          errors: ['Empty or invalid cart']
        },
        { status: 400 }
      );
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

        // Check if product is still available
        // if (!productData.available) {
        //   validationErrors.push({
        //     itemId: item.id,
        //     name: item.name || productData.name,
        //     message: 'Product is no longer available'
        //   });
        //   return;
        // }

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

        // Check stock availability (if tracked)
        // if (productData.stock !== undefined && item.amount > productData.stock) {
        //   validationErrors.push({
        //     itemId: item.id,
        //     name: item.name || productData.name,
        //     message: 'Not enough stock',
        //     requested: item.amount,
        //     available: productData.stock
        //   });
        // }

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

    // Check if any voucher code needs validation
    // This is a placeholder - implement actual voucher validation logic
    // if (cartItems.voucherCode) {
    //   try {
    // Validate voucher logic would go here
    // const isVoucherValid = await validateVoucher(cartItems.voucherCode, validatedItems);
    // if (!isVoucherValid) {
    //   validationErrors.push({
    //     message: 'Voucher is invalid or expired'
    //   });
    // }
    // } catch (error) {
    //   validationErrors.push({
    //     message: 'Error validating voucher'
    //   });
    // }
    // }

    // Return validation results
    return NextResponse.json({
      isValid: validationErrors.length === 0,
      validatedItems,
      errors: validationErrors.length > 0 ? validationErrors : null
    });
  } catch (error) {
    console.error('Cart validation error:', error);
    console.log(error)
    return NextResponse.json(
      {
        isValid: false,
        errors: ['Server error during cart validation']
      },
      { status: 500 }
    );
  }
}
