import { describe, expect, it, vi } from 'vitest';

import { CartRouteContent } from './cart-route-content';

const { useCartQueryMock } = vi.hoisted(() => ({ useCartQueryMock: vi.fn() }));

vi.mock('../model/use-cart-query', () => ({ useCartQuery: useCartQueryMock }));

describe('CartRouteContent', () => {
  it('장바구니 조회 결과와 요청 상태를 화면에 전달한다', () => {
    const refetch = vi.fn();
    const items = [{ id: '10', ingredient: '기본 옵션', name: '양파', price: 3900, quantity: 1 }];
    useCartQueryMock.mockReturnValue({
      data: { cartId: 3, items },
      error: null,
      isPending: false,
      refetch,
    });

    const page = CartRouteContent({ apiEnabled: true });

    expect(page.props).toMatchObject({ cartId: 3, isLoading: false, items });
    page.props.onRetry();
    expect(refetch).toHaveBeenCalledOnce();
  });
});
