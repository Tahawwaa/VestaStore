import { products } from '../data/products';
import type { CartItem, StoredCartItem } from '../types/cart';
export const MAX_QUANTITY = 10;
export const cartKey = (id: string, size: string, color: string) => `${id}:${size}:${color}`;
export function validateCart(value: unknown): StoredCartItem[] {
  if (!Array.isArray(value)) return [];
  const valid = new Map<string, StoredCartItem>();
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const item = entry as Partial<StoredCartItem>;
    const product = products.find(p => p.id === item.productId && p.isAvailable);
    if (!product || !product.sizes.some(s => s === item.selectedSize) || !product.colors.some(c => c.value === item.colorValue) || typeof item.quantity !== 'number' || !Number.isFinite(item.quantity) || item.quantity < 1) continue;
    const key = cartKey(product.id, item.selectedSize!, item.colorValue!);
    const quantity = Math.min(MAX_QUANTITY, Math.floor(item.quantity) + (valid.get(key)?.quantity ?? 0));
    valid.set(key, { productId: product.id, selectedSize: item.selectedSize!, colorValue: item.colorValue!, quantity });
  }
  return [...valid.values()];
}
export function hydrateCart(items: StoredCartItem[]): CartItem[] {
  return items.flatMap(item => {
    const product = products.find(p => p.id === item.productId);
    const selectedColor = product?.colors.find(c => c.value === item.colorValue);
    return product && selectedColor ? [{ key: cartKey(product.id,item.selectedSize,item.colorValue), product, quantity: item.quantity, selectedSize: item.selectedSize, selectedColor }] : [];
  });
}
export const shippingCost = (subtotal: number, express = false) => subtotal === 0 ? 0 : (subtotal >= 3000000 ? 0 : 69000) + (express ? 80000 : 0);
