// src/__test__/getItemsPriceTotal.test.ts
import { getItemsPriceTotal } from '../services/getItemsPriceTotal';

describe('getItemsPriceTotal', () => {
  test('should return 0 when items is null', () => {
    expect(getItemsPriceTotal(null)).toBe(0);
  });

  test('should return 0 when items is undefined', () => {
    expect(getItemsPriceTotal(undefined)).toBe(0);
  });

  test('should return 0 when items is an empty array', () => {
    expect(getItemsPriceTotal([])).toBe(0);
  });

  test('should correctly calculate total for a single item', () => {
    const items = [
      { price: 10, amount: 2 }
    ];
    expect(getItemsPriceTotal(items)).toBe(20);
  });

  test('should correctly calculate total for multiple items', () => {
    const items = [
      { price: 10, amount: 2 },
      { price: 15, amount: 3 },
      { price: 20, amount: 1 }
    ];
    // (10*2) + (15*3) + (20*1) = 20 + 45 + 20 = 85
    expect(getItemsPriceTotal(items)).toBe(85);
  });

  test('should handle zero price items', () => {
    const items = [
      { price: 0, amount: 5 },
      { price: 10, amount: 1 }
    ];
    expect(getItemsPriceTotal(items)).toBe(10);
  });

  test('should handle zero amount items', () => {
    const items = [
      { price: 10, amount: 0 },
      { price: 20, amount: 2 }
    ];
    expect(getItemsPriceTotal(items)).toBe(40);
  });

  test('should handle decimal values correctly', () => {
    const items = [
      { price: 10.5, amount: 2 },
      { price: 15.75, amount: 1 }
    ];
    // (10.5*2) + (15.75*1) = 21 + 15.75 = 36.75
    expect(getItemsPriceTotal(items)).toBe(36.75);
  });

  test('should not handle negative values (edge case)', () => {
    const items = [
      { price: -10, amount: 2 },
      { price: 15, amount: -1 }
    ];
    // (-10*2) + (15*-1) = -20 + (-15) = -35
    expect(getItemsPriceTotal(items)).toBe(0);
  });

  // Update this test in your test file
  test('should handle missing price or amount properties', () => {
    const items = [
      { price: 10 }, // Missing amount
      { amount: 3 }  // Missing price
    ];
    // With the fixed implementation, it should return 0 instead of NaN
    expect(getItemsPriceTotal(items)).toBe(0);
  });
})
;
