import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import { ProductDetailImages, ProductDetailPage, ProductImage } from './product-detail-page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

describe('product detail images', () => {
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
  it('섹션 사이에 밝은 surface-secondary 구분 영역을 사용한다', () => {
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

    expect(markup).toContain('border-[var(--surface-secondary)]');
    expect(markup).not.toContain('border-border border-t-8');
  });
});
