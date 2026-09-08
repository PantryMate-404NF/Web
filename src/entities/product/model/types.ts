export type ProductId = 'organic-broccoli' | 'sweet-banana' | 'fresh-milk' | 'soft-tofu';

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
