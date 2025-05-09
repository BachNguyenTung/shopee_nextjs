export const getItemsPriceTotal = (items) => {
  if (!items || !items.length) {
    return 0;
  }

  let total = items.reduce((checkoutPriceTotal, item) => {
    // Check if price and amount both exist and are numbers
    const price = typeof item.price === 'number' ? item.price : 0;
    const amount = typeof item.amount === 'number' ? item.amount : 0;

    // Calculate the item subtotal
    const itemTotal = price * amount;

    // Only add positive values to the total
    return checkoutPriceTotal + (itemTotal > 0 ? itemTotal : 0);
  }, 0);

  // Ensure we never return a negative value
  return Math.max(0, total);
};
