import { describe, expect, it, vi } from 'vitest';

import { OrderRouteContent } from './order-route-content';

const { useCartQueryMock } = vi.hoisted(() => ({ useCartQueryMock: vi.fn() }));

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

    const page = OrderRouteContent({
      apiEnabled: true,
      cartId: 99,
      selectedItemIds: ['10'],
    });

    expect(page.props).toMatchObject({ cartId: 3, items, selectedItemIds: ['10'] });
  });
});
