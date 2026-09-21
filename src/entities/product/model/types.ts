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

export interface ProductOption {
  id: string;
  label: string;
  price: number;
}

export interface ProductDetail {
  id: ProductId;
  detailImageUrls?: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  category: string;
  name: string;
  options?: ProductOption[];
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
  imageUrl?: string;
  productId?: ProductId;
  name: string;
  price: number;
  unitPrice: string;
}

export interface SearchProduct {
  id: string;
  detailProductId?: ProductId;
  imageUrl: string;
  name: string;
  price: number;
  unit: string;
  shippingLabel: string;
  isAvailable: boolean;
  searchKeywords: string[];
}
