export interface ProductDetailDto {
  productId: number;
  sku: string;
  name: string;
  categoryId: number;
  categoryName: string | null;
  price: number;
  unit: string;
  capacity: number | null;
  packageCount: number | null;
  origin: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  images: string[];
  stockQuantity: number;
  status: string;
  ingredientId: number | null;
}
