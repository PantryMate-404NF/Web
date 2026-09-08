export interface ProductDetail {
  id: string;
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
  name: string;
  price: number;
  unitPrice: string;
}
