import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import type { CartItemMutationResponseDto, CartResponseDto } from '@/entities/cart/api/cart.dto';
import { PRODUCT_COMMERCE_MOCK_IDS } from '@/entities/product/model/mock';
import { server } from '@/mocks/server';
import type { ApiResponse } from '@/shared/api/api-response';

import { resetCartMock } from './cart';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetCartMock();
});
afterAll(() => server.close());

describe('cartHandlers', () => {
  it('상품을 담은 뒤 같은 장바구니에서 조회한다', async () => {
    const addResponse = await fetch('http://localhost:8080/api/carts/items', {
      body: JSON.stringify({
        productId: PRODUCT_COMMERCE_MOCK_IDS['free-range-eggs'],
        quantity: 2,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const added = (await addResponse.json()) as ApiResponse<CartItemMutationResponseDto>;
    const cartResponse = await fetch('http://localhost:8080/api/carts');
    const cart = (await cartResponse.json()) as ApiResponse<CartResponseDto>;

    expect(addResponse.status).toBe(201);
    expect(added.data).toMatchObject({ quantity: 2 });
    expect(cart.data?.items).toEqual([
      expect.objectContaining({ productName: '완전방사 무항생제 유정란(10구)', quantity: 2 }),
    ]);
  });
});
