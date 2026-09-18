import type { ProductDetail } from '@/entities/product/model/types';

export function selectFavoriteProducts(
  favoriteProductIds: readonly string[],
  products: readonly ProductDetail[],
): ProductDetail[] {
  const productById = new Map<string, ProductDetail>(
    products.map((product) => [product.id, product]),
  );

  return favoriteProductIds.flatMap((productId) => {
    const product = productById.get(productId);
    return product ? [product] : [];
  });
}
