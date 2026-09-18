import { describe, expect, it, vi } from 'vitest';

import { OrderRouteContent } from './order-route-content';

const { useAuthSessionMock, useCartQueryMock } = vi.hoisted(() => ({
  useAuthSessionMock: vi.fn(),
  useCartQueryMock: vi.fn(),
}));

vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('@/views/cart/model/use-cart-query', () => ({ useCartQuery: useCartQueryMock }));

describe('OrderRouteContent', () => {
  it('주문서에 서버 장바구니와 선택 항목을 전달한다', () => {
    const items = [{ id: '10', ingredient: '기본 옵션', name: '양파', price: 3900, quantity: 1 }];
    useCartQueryMock.mockReturnValue({
      data: { cartId: 3, items },
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useAuthSessionMock.mockReturnValue({ state: 'complete' });

    const page = OrderRouteContent({
      cartId: 99,
      selectedItemIds: ['10'],
    });

    expect(useCartQueryMock).toHaveBeenCalledWith(true);
    expect(page.props).toMatchObject({ cartId: 3, items, selectedItemIds: ['10'] });
  });

  it('로그인 세션 복구 중에는 주문 장바구니 조회를 시작하지 않는다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'loading' });
    useCartQueryMock.mockReturnValue({ data: undefined, error: null, isPending: true });

    const page = OrderRouteContent({ selectedItemIds: ['10'] });

    expect(useCartQueryMock).toHaveBeenCalledWith(false);
    expect(page.props).toMatchObject({ isLoading: true });
  });
});
