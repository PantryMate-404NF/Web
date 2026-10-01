import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import {
  ProductDetailImages,
  ProductDetailPage,
  ProductImage,
  ProductSectionDivider,
} from './product-detail-page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

describe('product detail images', () => {
  it('구간 구분선을 Grey-100 배경으로 표시한다', () => {
    const markup = renderToStaticMarkup(createElement(ProductSectionDivider));

    expect(markup).toBe(
      '<div aria-hidden="true" class="h-2 w-full bg-[var(--primitive-grey-100)]"></div>',
    );
  });

  it('대표 이미지가 없으면 대체 UI를 표시한다', () => {
    const product = getProductById('sweet-banana');

    if (!product) throw new Error('이미지 없는 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(createElement(ProductImage, { product }));

    expect(markup).toContain('상품 이미지가 준비 중이에요');
  });

  it('상세 이미지가 없으면 빈 섹션을 렌더링하지 않는다', () => {
    const product = getProductById('sweet-banana');

    if (!product) throw new Error('상세 이미지가 없는 상품 목업이 필요합니다.');

    const markup = renderToStaticMarkup(createElement(ProductDetailImages, { product }));

    expect(markup).toBe('');
  });
});

describe('product detail section separators', () => {
  it('섹션 사이에 Grey-100 구분선을 사용한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('상품 상세 목업이 필요합니다.');

    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(ProductDetailPage, { product }),
      ),
    );

    expect(markup).toContain('bg-[var(--primitive-grey-100)]');
    expect(markup).not.toContain('border-t-8');
  });
});

describe('product detail header', () => {
  it('피그마 기준 헤더 여백과 24px 장바구니 아이콘을 사용한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('상품 상세 목업이 필요합니다.');

    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(ProductDetailPage, { product }),
      ),
    );

    expect(markup).toContain('relative flex h-10 items-center pr-1');
    expect(markup).toMatch(/width="24" height="24"[^>]+src="\/icons\/home\/product-cart\.svg"/);
    expect(markup).toContain('absolute top-0 right-4 flex h-12 items-center');
    expect(markup).toContain('h-12 w-10');
    expect(markup).toMatch(/width="24" height="24"[^>]+src="\/icons\/product\/like-line\.svg"/);
    expect(markup).toMatch(
      /width="24" height="24"[^>]+src="\/icons\/product\/expand-screen-line\.svg"/,
    );
  });
});

describe('product detail action icons', () => {
  it.each(['like-line.svg', 'expand-screen-line.svg'])(
    '최신 피그마의 채움형 외곽선 자산을 사용한다: %s',
    (fileName) => {
      const svg = readFileSync(join(process.cwd(), 'public/icons/product', fileName), 'utf8');

      expect(svg).toContain('id="Vector (Stroke)"');
      expect(svg).not.toContain('stroke-linecap="round"');
    },
  );
});

describe('product detail colors', () => {
  it('카테고리와 정보 라벨에 피그마 색상 토큰을 사용한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('상품 상세 목업이 필요합니다.');

    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(ProductDetailPage, { product }),
      ),
    );

    expect(markup).toContain('bg-surface-secondary text-text-secondary');
    expect(markup).toContain('text-disabled w-20 shrink-0');
  });
});

describe('product detail refresh error', () => {
  it('재조회 실패 시 기존 상세 위에 재시도 안내를 표시한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('상품 상세 목업이 필요합니다.');

    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(ProductDetailPage, {
          product,
          refreshError: true,
          onRefreshRetry: vi.fn(),
        }),
      ),
    );

    expect(markup).toContain('최신 상품 정보를 불러오지 못했어요.');
    expect(markup).toContain('다시 시도');
  });
});
