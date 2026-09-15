export type ProductId =
  | 'organic-broccoli'
  | 'sweet-banana'
  | 'fresh-milk'
  | 'soft-tofu'
  | 'domestic-onion'
  | 'pesticide-free-potato'
  | 'free-range-eggs'
  | 'dried-rapeseed-greens'
  | 'blanched-chwinamul'
  | 'bujigaengi-greens'
  | 'buckwheat-tofu-noodles'
  | 'garlic-cream-cheese'
  | 'low-sugar-plum-syrup';

export interface ProductDetail {
  id: ProductId;
  category: string;
  name: string;
  summary: string;
  price: number;
  reviewCount: number;
  rating: number;
  isAvailable: boolean;
  delivery: string;
  deliveryFee: string;
  seller: string;
  storageMethod: string;
  saleUnit: string;
  weight: string;
  origin: string;
}

export interface RelatedProduct {
  id: string;
  productId?: ProductId;
  name: string;
  price: number;
  unitPrice: string;
}
