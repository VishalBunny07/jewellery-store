
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  material: string;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
}
