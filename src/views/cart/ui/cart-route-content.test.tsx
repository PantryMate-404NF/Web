import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { CartPreviewRouteContent, CartRouteContent } from './cart-route-content';

const { useAuthSessionMock, useCartMutationsMock, useCartQueryMock } = vi.hoisted(() => ({
  useAuthSessionMock: vi.fn(),
  useCartMutationsMock: vi.fn(),
  useCartQueryMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ back: vi.fn() }) }));
vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('../model/use-cart-query', () => ({ useCartQuery: useCartQueryMock }));
vi.mock('../model/use-cart-mutations', () => ({ useCartMutations: useCartMutationsMock }));

describe('CartRouteContent', () => {
  it('장바구니 조회 결과와 요청 상태를 화면에 전달한다', () => {
    const refetch = vi.fn();
    const removeItems = vi.fn();
    const updateQuantity = vi.fn();
    const items = [{ id: '10', ingredient: '기본 옵션', name: '양파', price: 3900, quantity: 1 }];
    useCartQueryMock.mockReturnValue({
      data: { cartId: 3, items },
      error: null,
      isPending: false,
      refetch,
    });
    useCartMutationsMock.mockReturnValue({
      error: null,
      isPending: false,
      removeItems,
      updateQuantity,
    });
    useAuthSessionMock.mockReturnValue({ state: 'complete' });

    const page = CartRouteContent();

    expect(useCartQueryMock).toHaveBeenCalledWith(true);
    expect(page.props).toMatchObject({
      cartId: 3,
      isLoading: false,
      isMutating: false,
      items,
      onRemoveItems: removeItems,
      onUpdateQuantity: updateQuantity,
    });
    page.props.onRetry();
    expect(refetch).toHaveBeenCalledOnce();
  });

  it('로그인 세션 복구 중에는 장바구니 조회를 시작하지 않는다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'loading' });
    useCartQueryMock.mockReturnValue({ data: undefined, error: null, isPending: true });
    useCartMutationsMock.mockReturnValue({ error: null, isPending: false });

    const page = CartRouteContent();

    expect(useCartQueryMock).toHaveBeenCalledWith(false);
    expect(page.props).toMatchObject({ isLoading: true });
  });

  it('비로그인 상태는 재시도 오류가 아닌 로그인 안내 상태로 전달한다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'guest' });
    useCartQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });
    useCartMutationsMock.mockReturnValue({ error: null, isPending: false });

    const page = CartRouteContent();

    expect(useCartQueryMock).toHaveBeenCalledWith(false);
    expect(page.props).toMatchObject({ isUnauthorized: true });
    expect(page.props.errorMessage).toBeUndefined();
    expect(page.props.onRetry).toBeUndefined();
  });

  it('개발 미리보기 상품을 인증과 API 없이 표시한다', () => {
    const previewItems = [
      { id: 'preview', ingredient: '기본 옵션', name: '미리보기 상품', price: 5900, quantity: 1 },
    ];
    const markup = renderToStaticMarkup(
      createElement(CartPreviewRouteContent, { initialItems: previewItems }),
    );

    expect(markup).toContain('미리보기 상품');
    expect(markup).not.toContain('로그인이 필요해요');
  });
});
