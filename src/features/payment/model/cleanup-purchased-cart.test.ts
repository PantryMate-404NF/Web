import { describe, expect, it, vi } from 'vitest';

import { cleanupPurchasedCartItems } from './cleanup-purchased-cart';

describe('cleanupPurchasedCartItems', () => {
  it('주문에 선택한 상품만 삭제 요청하고 장바구니를 새로고침한다', async () => {
    const deleteItem = vi.fn().mockResolvedValue(undefined);
    const refreshCart = vi.fn().mockResolvedValue([99]);

    await expect(cleanupPurchasedCartItems([20, 21], { deleteItem, refreshCart })).resolves.toEqual(
      { completed: true, remainingCartItemIds: [] },
    );

    expect(deleteItem).toHaveBeenCalledTimes(2);
    expect(deleteItem).toHaveBeenCalledWith(20);
    expect(deleteItem).toHaveBeenCalledWith(21);
    expect(refreshCart).toHaveBeenCalledOnce();
  });

  it('일부 삭제가 실패해도 나머지 삭제와 장바구니 새로고침을 시도한다', async () => {
    const deleteItem = vi
      .fn()
      .mockRejectedValueOnce(new Error('delete failed'))
      .mockResolvedValueOnce(undefined);
    const refreshCart = vi.fn().mockResolvedValue([20, 99]);

    await expect(cleanupPurchasedCartItems([20, 21], { deleteItem, refreshCart })).resolves.toEqual(
      { completed: false, remainingCartItemIds: [20] },
    );

    expect(deleteItem).toHaveBeenCalledTimes(2);
    expect(refreshCart).toHaveBeenCalledOnce();
  });

  it('새로고침 결과가 대상 상품을 포함하지 않으면 삭제 요청 실패도 복구된 것으로 본다', async () => {
    const deleteItem = vi.fn().mockRejectedValue(new Error('already removed'));
    const refreshCart = vi.fn().mockResolvedValue([99]);

    await expect(cleanupPurchasedCartItems([20], { deleteItem, refreshCart })).resolves.toEqual({
      completed: true,
      remainingCartItemIds: [],
    });
  });

  it('장바구니 새로고침에 실패하면 삭제 여부를 단정하지 않고 선택 ID를 재시도 대상으로 남긴다', async () => {
    const deleteItem = vi.fn().mockResolvedValue(undefined);
    const refreshCart = vi.fn().mockRejectedValue(new Error('refresh failed'));

    await expect(cleanupPurchasedCartItems([20, 21], { deleteItem, refreshCart })).resolves.toEqual(
      { completed: false, remainingCartItemIds: [20, 21] },
    );
  });

  it('유효한 상품 ID가 없으면 삭제와 새로고침을 하지 않는다', async () => {
    const deleteItem = vi.fn();
    const refreshCart = vi.fn();

    await expect(cleanupPurchasedCartItems([], { deleteItem, refreshCart })).resolves.toEqual({
      completed: true,
      remainingCartItemIds: [],
    });

    expect(deleteItem).not.toHaveBeenCalled();
    expect(refreshCart).not.toHaveBeenCalled();
  });
});
