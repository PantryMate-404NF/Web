import type { CartProduct } from '@/entities/cart/model/cart-store';
import { productSearchMocks } from '@/entities/product/model/search-mock';
import type { SearchProduct } from '@/entities/product/model/types';

export type ProductSearchPreviewState = 'loading' | 'error';
export type ProductSearchViewState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface ProductSearchViewStateInput {
  hasError?: boolean;
  isPending?: boolean;
  query: string;
  resultCount?: number;
}

interface SearchMockProductsOptions {
  previewState?: ProductSearchPreviewState;
  signal?: AbortSignal;
}

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

export function getProductSearchViewState({
  hasError = false,
  isPending = false,
  query,
  resultCount = 0,
}: ProductSearchViewStateInput): ProductSearchViewState {
  if (!query.trim()) return 'idle';
  if (isPending) return 'loading';
  if (hasError) return 'error';
  return resultCount > 0 ? 'success' : 'empty';
}

export async function searchMockProducts(
  query: string,
  { previewState, signal }: SearchMockProductsOptions = {},
): Promise<SearchProduct[]> {
  if (previewState === 'loading') {
    return new Promise((_, reject) => {
      signal?.addEventListener('abort', () => reject(new Error('상품 검색 요청이 취소됐어요.')), {
        once: true,
      });
    });
  }

  await Promise.resolve();

  if (previewState === 'error') {
    throw new Error('상품 검색 결과를 불러오지 못했어요.');
  }

  return findProductsByQuery(productSearchMocks, query);
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
