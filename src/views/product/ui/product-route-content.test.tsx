import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getProductById } from '@/entities/product/model/mock';

import { ProductRouteContent } from './product-route-content';

const { notFoundMock, refetchMock, useProductDetailQueryMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(),
  refetchMock: vi.fn(),
  useProductDetailQueryMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({ notFound: notFoundMock }));
vi.mock('@/shared/config/cart-write-mode', () => ({ CART_HREF: '/cart', CART_WRITE_MODE: 'api' }));
vi.mock('@/entities/product/api/use-product-detail-query', () => ({
  useProductDetailQuery: useProductDetailQueryMock,
}));

describe('ProductRouteContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProductDetailQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isPending: false,
      refetch: refetchMock,
    });
  });

  it('연결된 실제 상품 ID로 상세 API 조회를 활성화한다', () => {
    const fallback = getProductById('free-range-eggs');

    ProductRouteContent({ productId: 'free-range-eggs' });

    expect(useProductDetailQueryMock).toHaveBeenCalledWith(157, fallback, true);
  });

  it('상품 상세 조회 중에는 로딩 상태를 표시한다', () => {
    useProductDetailQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
      refetch: refetchMock,
    });

    const markup = renderToStaticMarkup(
      createElement(ProductRouteContent, { productId: 'free-range-eggs' }),
    );

    expect(markup).toContain('상품 상세를 불러오는 중입니다.');
  });

  it('상품 상세 조회 실패 시 재시도 가능한 오류 상태를 표시한다', () => {
    useProductDetailQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('상품 조회 실패'),
      isPending: false,
      refetch: refetchMock,
    });

    const page = ProductRouteContent({ productId: 'free-range-eggs' });
    const errorState = page.props.children;

    expect(errorState.props.title).toBe('상품을 불러오지 못했어요');
    errorState.props.onRetry();
    expect(refetchMock).toHaveBeenCalledOnce();
  });

  it('API 상품을 조회하면 실제 상품 데이터로 상세 화면을 렌더링한다', () => {
    const apiProduct = {
      ...getProductById('free-range-eggs')!,
      commerceProductId: 157,
      options: undefined,
      price: 6700,
    };
    useProductDetailQueryMock.mockReturnValue({
      data: apiProduct,
      error: null,
      isPending: false,
      refetch: refetchMock,
    });

    const page = ProductRouteContent({ productId: 'free-range-eggs' });

    expect(page.props.product).toBe(apiProduct);
  });

  it('실제 상품 ID가 없는 디자인 상품은 API를 호출하지 않고 기존 상세를 유지한다', () => {
    const fallback = getProductById('sweet-banana');

    const page = ProductRouteContent({ productId: 'sweet-banana' });

    expect(useProductDetailQueryMock).toHaveBeenCalledWith(undefined, fallback, false);
    expect(page.props.product).toBe(fallback);
  });

  it('알 수 없는 상품 경로는 notFound를 호출한다', () => {
    ProductRouteContent({ productId: 'unknown-product' });

    expect(notFoundMock).toHaveBeenCalledOnce();
  });
});
