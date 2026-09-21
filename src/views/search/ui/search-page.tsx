'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCartStore } from '@/entities/cart/model/cart-store';
import type { SearchProduct } from '@/entities/product/model/types';
import {
  getProductSearchViewState,
  toCartProduct,
  type ProductSearchPreviewState,
  type ProductSearchViewState,
} from '@/features/product-search/model/product-search';
import { selectRecommendedKeyword } from '@/features/product-search/model/recommended-search-keywords';
import { useProductSearchQuery } from '@/features/product-search/model/use-product-search-query';
import { RecommendedSearchKeywords } from '@/features/product-search/ui/recommended-search-keywords';
import { SearchProductCard } from '@/features/product-search/ui/search-product-card';
import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

interface SearchPageProps {
  initialQuery?: string;
  previewState?: ProductSearchPreviewState;
}

function getSearchAnnouncement(viewState: ProductSearchViewState, resultCount: number): string {
  if (viewState === 'loading') return '상품 검색 결과를 불러오는 중입니다.';
  if (viewState === 'error') return '상품 검색 중 오류가 발생했습니다.';
  if (viewState === 'empty') return '상품 검색 결과가 없습니다.';
  if (viewState === 'success') return `상품 검색 결과 ${resultCount}개입니다.`;
  return '';
}

function SearchLoadingState() {
  return (
    <div aria-hidden="true" className="grid grid-cols-2 gap-x-4 gap-y-6">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="h-[273px] w-full" key={index}>
          <div className="bg-skeleton-container aspect-square w-full animate-pulse rounded-lg" />
          <div className="bg-skeleton-container mt-2 h-[94px] animate-pulse rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SearchPage({ initialQuery = '', previewState }: SearchPageProps) {
  const router = useRouter();
  const addProducts = useCartStore((state) => state.addProducts);
  const normalizedInitialQuery = initialQuery.trim();
  const [query, setQuery] = useState(normalizedInitialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(normalizedInitialQuery);
  const [statusMessage, setStatusMessage] = useState('');
  const {
    data: searchResults = [],
    error,
    isPending,
    refetch,
  } = useProductSearchQuery(submittedQuery, previewState);
  const viewState = getProductSearchViewState({
    hasError: Boolean(error),
    isPending,
    query: submittedQuery,
    resultCount: searchResults.length,
  });

  function executeSearch(nextQuery: string) {
    const normalizedQuery = nextQuery.trim();
    setQuery(normalizedQuery);
    setSubmittedQuery(normalizedQuery);
    setStatusMessage('');
    router.replace(
      normalizedQuery ? `/search?q=${encodeURIComponent(normalizedQuery)}` : '/search',
    );
  }

  function handleKeywordSelect(keyword: string) {
    executeSearch(selectRecommendedKeyword(keyword));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeSearch(query);
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  }

  function handleAdd(product: SearchProduct) {
    const cartProduct = toCartProduct(product);
    if (!cartProduct) return;

    addProducts([cartProduct]);
    setStatusMessage(`${product.name}을 장바구니에 담았어요.`);
  }

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col">
      <form className="flex h-16 items-center gap-0.5 pr-10" onSubmit={handleSubmit} role="search">
        <button
          aria-label="이전 페이지로 이동"
          className="focus-visible:ring-ring grid size-10 shrink-0 place-items-center rounded-full focus-visible:ring-2"
          onClick={handleBack}
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/icons/navigation/back.svg"
            width={24}
          />
        </button>
        <label className="flex h-[42px] min-w-0 flex-1 items-center rounded-full border border-[var(--primitive-grey-300)] px-1.5">
          <span className="grid size-10 shrink-0 place-items-center">
            <Image alt="" aria-hidden="true" height={24} src="/icons/search-line.svg" width={24} />
          </span>
          <span className="sr-only">상품 검색</span>
          <input
            autoFocus
            className="text-title-4 placeholder:text-muted-foreground focus-visible:ring-ring min-w-0 flex-1 rounded-sm bg-transparent font-medium outline-none focus-visible:ring-2"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색"
            value={query}
          />
        </label>
      </form>

      {submittedQuery ? (
        <section aria-labelledby="search-results-title" className="px-4 pb-8">
          <h1
            className="text-body-3 py-4 leading-6 font-normal text-[var(--primitive-grey-600)]"
            id="search-results-title"
          >
            상품 검색 결과{' '}
            {(viewState === 'success' || viewState === 'empty') && (
              <>
                <strong className="font-semibold text-[var(--primitive-primary-700)]">
                  {searchResults.length}
                </strong>
                개
              </>
            )}
          </h1>

          {viewState === 'loading' ? (
            <SearchLoadingState />
          ) : viewState === 'error' ? (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <p className="text-title-3 font-semibold">검색 결과를 불러오지 못했어요</p>
                <p className="text-body-4 text-muted-foreground mt-2">
                  잠시 후 다시 시도해 주세요.
                </p>
                <button
                  className="bg-foreground text-background focus-visible:ring-ring mt-4 h-10 rounded-lg px-4 text-sm font-semibold focus-visible:ring-2"
                  onClick={() => void refetch()}
                  type="button"
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : viewState === 'success' ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {searchResults.map((product, index) => (
                <SearchProductCard
                  eager={index < 2}
                  key={product.id}
                  onAdd={handleAdd}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <p className="text-title-3 font-semibold">검색 결과가 없어요</p>
                <p className="text-body-4 text-muted-foreground mt-2">
                  다른 검색어를 입력해 보세요.
                </p>
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          <RecommendedSearchKeywords onSelect={handleKeywordSelect} />
          <BottomNavigation />
        </>
      )}

      <p aria-live="polite" className="sr-only">
        {statusMessage}
      </p>
      <p aria-live="polite" className="sr-only" role="status">
        {getSearchAnnouncement(viewState, searchResults.length)}
      </p>
    </main>
  );
}
