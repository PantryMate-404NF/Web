'use client';

import { useQuery } from '@tanstack/react-query';

import { searchMockProducts, type ProductSearchPreviewState } from './product-search';

export const PRODUCT_SEARCH_QUERY_KEY = ['products', 'search'] as const;

export function useProductSearchQuery(query: string, previewState?: ProductSearchPreviewState) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: [...PRODUCT_SEARCH_QUERY_KEY, normalizedQuery, previewState ?? 'default'],
    queryFn: ({ signal }) => searchMockProducts(normalizedQuery, { previewState, signal }),
    enabled: normalizedQuery.length > 0,
    retry: false,
    staleTime: 60_000,
  });
}
