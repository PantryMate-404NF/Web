import type { CartProduct } from '@/entities/cart/model/cart-store';
import type { SearchProduct } from '@/entities/product/model/types';

function normalizeSearchQuery(query: string): string {
  return query.trim().toLocaleLowerCase('ko-KR');
}

export function findProductsByQuery(products: SearchProduct[], query: string): SearchProduct[] {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) return [];

  return products.filter((product) => {
    const searchableText = [product.name, ...product.searchKeywords]
      .join(' ')
      .toLocaleLowerCase('ko-KR');

    return searchableText.includes(normalizedQuery);
  });
}

export function toCartProduct(product: SearchProduct): CartProduct | null {
  if (!product.isAvailable) return null;

  return {
    id: product.id,
    ingredient: product.searchKeywords[0] ?? product.name,
    name: product.name,
    price: product.price,
    purchasable: true,
    thumbnailUrl: product.imageUrl,
  };
}
