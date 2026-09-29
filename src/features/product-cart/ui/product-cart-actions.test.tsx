import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import { ProductCartActions } from './product-cart-actions';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('ProductCartActions', () => {
  it('상품 상세 하단 CTA에 64px 높이와 8px 상단 여백을 적용한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('판매 가능 상품 목업이 필요합니다.');

    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(ProductCartActions, { product }),
      ),
    );

    expect(markup).toContain('h-16');
    expect(markup).toContain('pt-2');
    expect(markup).toContain('gap-2');
  });

  it('판매 불가 상품의 장바구니 버튼을 비활성화한다', () => {
    const product = getProductById('organic-broccoli');

    if (!product) throw new Error('판매 불가 상품 목업이 필요합니다.');

    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(ProductCartActions, { product }),
      ),
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain('판매 불가 상품은 장바구니에 담을 수 없습니다');
  });

  it('장바구니 버튼에 피그마의 불투명 배경색과 전경색을 적용한다', () => {
    const product = getProductById('free-range-eggs');

    if (!product) throw new Error('판매 가능 상품 목업이 필요합니다.');

    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(ProductCartActions, { product }),
      ),
    );

    expect(markup).toContain('bg-[var(--primitive-primary-100)]');
    expect(markup).toContain('text-[var(--primitive-primary-700)]');
    expect(markup).not.toContain('bg-primary/15 text-primary');
  });
});
