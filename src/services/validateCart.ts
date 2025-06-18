interface ValidationError {
  itemId?: string;
  name?: string;
  message: string;
  oldPrice?: number;
  newPrice?: number;
  requested?: number;
  available?: number;
  variation?: string;
}

interface ValidationResponse {
  isValid: boolean;
  validatedItems?: any[];
  errors: ValidationError[] | null;
}

/**
 * Validates the cart items against the database to ensure
 * prices are current, items are in stock, and variations are available
 */
export async function validateCart(cartItems: any[]): Promise<ValidationResponse> {
  try {
    const response = await fetch('/api/validate-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating cart:', error);
    return {
      isValid: false,
      errors: [{ message: 'Failed to validate cart. Please try again.' }]
    };
  }
}

/**
 * Handles validation errors by formatting them for display
 */
export function formatValidationErrors(errors: ValidationError[]): string[] {
  if (!errors || errors.length === 0) {
    return [];
  }

  return errors.map(error => {
    if (error.name) {
      if (error.message === 'Price has changed') {
        return `Giá "${error.name}" đã thay đổi thành "₫${error.newPrice}". Vui lòng xoá "${error.name} "để tiếp tục mua hàng`;
      }
      if (error.message === 'Not enough stock') {
        return `(${error.available} sản phẩm "${error.name}" trong kho. Vui lòng xoá "${error.name}" để tiếp tục mua hàng`;
      }
      if (error.message === 'Selected variation is no longer available') {
        return `Phân loại "${error.variation}" cho "${error.name}" đã hết. Vui lòng xoá "${error.name}" để tiếp tục mua hàng`;
      }
      return `${error.name}: ${error.message}`;
    }
    return error.message;
  });
}
