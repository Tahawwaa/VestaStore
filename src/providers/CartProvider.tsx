import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product, ProductColor } from '../types/product';
import type { CartItem, StoredCartItem } from '../types/cart';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { cartKey, hydrateCart, MAX_QUANTITY, validateCart } from '../utils/cart';
interface CartContextValue {
  items: CartItem[]; count: number; subtotal: number; isOpen: boolean; setOpen: (value: boolean) => void;
  addItem: (product: Product, size: string, color: ProductColor, quantity: number) => boolean;
  updateQuantity: (key: string, quantity: number) => void; removeItem: (key: string) => void; clear: () => void;
  favorites: string[]; toggleFavorite: (id: string) => void; toast: string; notify: (message: string) => void; dismissToast: () => void;
}
const CartContext = createContext<CartContextValue | null>(null);
const validateFavorites = (value: unknown): string[] => Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
export function CartProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useLocalStorage<StoredCartItem[]>('rava-cart-v1', [], validateCart);
  const [favorites, setFavorites] = useLocalStorage<string[]>('rava-favorites-v1', [], validateFavorites);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const items = useMemo(() => hydrateCart(stored), [stored]);
  const notify = useCallback((message: string) => setToast(message), []);
  const dismissToast = useCallback(() => setToast(''), []);
  const addItem = (product: Product, size: string, color: ProductColor, quantity: number) => {
    if (!product.isAvailable || !product.sizes.some(s => s === size) || !product.colors.some(c => c.value === color.value) || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return false;
    const key = cartKey(product.id, size, color.value);
    const existing = items.find(i => i.key === key);
    if ((existing?.quantity ?? 0) + quantity > MAX_QUANTITY) { notify('حداکثر تعداد مجاز از هر محصول ۱۰ عدد است.'); return false; }
    setStored(previous => {
      const index = previous.findIndex(i => cartKey(i.productId,i.selectedSize,i.colorValue) === key);
      return index < 0 ? [...previous, { productId: product.id, selectedSize: size, colorValue: color.value, quantity }] : previous.map((item, i) => i === index ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) } : item);
    });
    notify('به سبد خرید شما اضافه شد.'); return true;
  };
  const updateQuantity = (key: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return;
    setStored(previous => previous.map(i => cartKey(i.productId,i.selectedSize,i.colorValue) === key ? { ...i, quantity } : i));
  };
  const removeItem = (key: string) => setStored(previous => previous.filter(i => cartKey(i.productId,i.selectedSize,i.colorValue) !== key));
  const toggleFavorite = (id: string) => setFavorites(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous,id]);
  return <CartContext.Provider value={{ items, count: items.reduce((sum,i) => sum+i.quantity,0), subtotal: items.reduce((sum,i) => sum+i.quantity*i.product.price,0), isOpen, setOpen, addItem, updateQuantity, removeItem, clear: () => setStored([]), favorites, toggleFavorite, toast, notify, dismissToast }}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('CartProvider is required'); return context; }
