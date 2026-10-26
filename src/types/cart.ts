import type { Product, ProductColor } from './product';
export interface CartItem { key: string; product: Product; quantity: number; selectedSize: string; selectedColor: ProductColor }
export interface StoredCartItem { productId: string; quantity: number; selectedSize: string; colorValue: string }
