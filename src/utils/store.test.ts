import { describe, expect, it } from 'vitest';
import { validateCart, hydrateCart, shippingCost, MAX_QUANTITY } from './cart';
import { validateCustomer } from './checkout';
import { filterProducts } from './filterProducts';
import { defaultFilters } from '../components/products/Filters';
import { products } from '../data/products';
const line = { productId: 'linen-blazer', selectedSize: 'M', colorValue: 'cream', quantity: 2 };
describe('persistent cart boundary', () => {
  it('rejects malformed, unavailable and impossible variants', () => {
    expect(validateCart(null)).toEqual([]);
    expect(
      validateCart([
        null,
        {},
        { ...line, productId: 'missing' },
        { ...line, selectedSize: '99' },
        { ...line, colorValue: 'purple' },
        { ...line, quantity: -1 },
        { ...line, quantity: Infinity },
        { productId: 'silk-scarf', selectedSize: 'تک‌سایز', colorValue: 'cream', quantity: 1 },
      ]),
    ).toEqual([]);
  });
  it('merges duplicate variants and caps excessive quantities', () => {
    expect(validateCart([line, line, { ...line, quantity: 20 }])).toEqual([
      { ...line, quantity: MAX_QUANTITY },
    ]);
  });
  it('uses the catalog price instead of a price persisted by a browser', () => {
    const result = hydrateCart(validateCart([{ ...line, price: 1 }]));
    expect(result[0].product.price).toBe(2490000);
    expect(result[0].selectedColor.name).toBe('کرم');
    expect(result[0].key).toBe('linen-blazer:M:cream');
  });
  it('keeps different sizes separate', () =>
    expect(validateCart([line, { ...line, selectedSize: 'L' }])).toHaveLength(2));
});
describe('shipping totals', () => {
  it('handles the free shipping threshold and express surcharge', () => {
    expect(shippingCost(0)).toBe(0);
    expect(shippingCost(2999999)).toBe(69000);
    expect(shippingCost(3000000)).toBe(0);
    expect(shippingCost(3000000, true)).toBe(80000);
    expect(shippingCost(1000000, true)).toBe(149000);
  });
});
describe('catalog discovery', () => {
  it('combines category, color, size, stock and price constraints', () => {
    const result = filterProducts(
      products,
      {
        ...defaultFilters,
        category: 'women',
        color: 'cream',
        size: 'M',
        available: true,
        maxPrice: 2000000,
      },
      [],
    );
    expect(result.map((p) => p.id)).toEqual(['soft-knit']);
  });
  it('sorts prices without mutating the original catalog', () => {
    const ids = products.map((p) => p.id);
    const result = filterProducts(products, { ...defaultFilters, sort: 'low' }, []);
    expect(result[0].id).toBe('silk-scarf');
    expect(result.at(-1)?.id).toBe('wool-coat');
    expect(products.map((p) => p.id)).toEqual(ids);
  });
  it('supports search, saved favorites and empty results', () => {
    expect(filterProducts(products, { ...defaultFilters, query: 'لينن' }, [])[0].id).toBe(
      'linen-blazer',
    );
    expect(
      filterProducts(products, { ...defaultFilters, favorites: true }, ['leather-bag']).map(
        (p) => p.id,
      ),
    ).toEqual(['leather-bag']);
    expect(filterProducts(products, { ...defaultFilters, query: 'چتر' }, [])).toHaveLength(0);
  });
});
describe('Persian checkout validation', () => {
  const valid = {
    name: 'کاربر آزمایشی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    city: 'تهران',
    address: 'نشانی آزمایشی، خیابان نمونه، پلاک ۱',
    postalCode: '۱۲۳۴۵۶۷۸۹۰',
  };
  it('accepts Persian and Arabic digits', () => {
    expect(validateCustomer(valid)).toEqual({});
    expect(validateCustomer({ ...valid, phone: '٠٩١٢٣٤٥٦٧٨٩', postalCode: '1234567890' })).toEqual(
      {},
    );
  });
  it('validates every required field', () => {
    expect(
      Object.keys(
        validateCustomer({ name: '', phone: '123', city: '', address: '', postalCode: '1' }),
      ),
    ).toHaveLength(5);
  });
});
