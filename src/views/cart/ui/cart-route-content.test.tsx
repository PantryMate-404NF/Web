import { describe, expect, it, vi } from 'vitest';

import { CartRouteContent } from './cart-route-content';

const { useCartMutationsMock, useCartQueryMock } = vi.hoisted(() => ({
  useCartMutationsMock: vi.fn(),
  useCartQueryMock: vi.fn(),
}));

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

    const page = CartRouteContent({ apiEnabled: true });

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
});
