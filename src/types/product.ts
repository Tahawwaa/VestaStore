export type ProductCategory = 'women' | 'men' | 'accessories' | 'shoes';
export type ProductSize =
  'XS' | 'S' | 'M' | 'L' | 'XL' | '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | 'تک‌سایز';
export interface ProductColor {
  name: string;
  value: string;
  hex: string;
}
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isAvailable: boolean;
  tags: string[];
}
