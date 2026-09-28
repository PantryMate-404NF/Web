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
    const addResponse = await fetch('http://localhost:8080/api/cart/items', {
      body: JSON.stringify({
        productId: PRODUCT_COMMERCE_MOCK_IDS['free-range-eggs'],
        quantity: 2,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const added = (await addResponse.json()) as ApiResponse<CartItemMutationResponseDto>;
    const cartResponse = await fetch('http://localhost:8080/api/cart');
    const cart = (await cartResponse.json()) as ApiResponse<CartResponseDto>;

    expect(addResponse.status).toBe(201);
    expect(added.data).toMatchObject({ quantity: 2 });
    expect(cart.data?.items).toEqual([
      expect.objectContaining({ productName: '완전방사 무항생제 유정란(10구)', quantity: 2 }),
    ]);
  });

  it('옵션별 상품 ID에 맞는 이름과 가격을 저장한다', async () => {
    const addResponse = await fetch('http://localhost:8080/api/cart/items', {
      body: JSON.stringify({ productId: 10703, quantity: 1 }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const cartResponse = await fetch('http://localhost:8080/api/cart');
    const cart = (await cartResponse.json()) as ApiResponse<CartResponseDto>;

    expect(addResponse.status).toBe(201);
    expect(cart.data?.items).toEqual([
      expect.objectContaining({ price: 7200, productName: expect.stringContaining('왕란') }),
    ]);
  });

  it('인증 사용자별로 목 장바구니를 격리한다', async () => {
    await fetch('http://localhost:8080/api/cart/items', {
      body: JSON.stringify({
        productId: PRODUCT_COMMERCE_MOCK_IDS['sweet-banana'],
        quantity: 1,
      }),
      headers: { Authorization: 'Bearer account-a', 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const accountAResponse = await fetch('http://localhost:8080/api/cart', {
      headers: { Authorization: 'Bearer account-a' },
    });
    const accountBResponse = await fetch('http://localhost:8080/api/cart', {
      headers: { Authorization: 'Bearer account-b' },
    });
    const accountA = (await accountAResponse.json()) as ApiResponse<CartResponseDto>;
    const accountB = (await accountBResponse.json()) as ApiResponse<CartResponseDto>;

    expect(accountA.data?.items).toHaveLength(1);
    expect(accountB.data?.items).toHaveLength(0);
  });

  it('판매 불가 상품의 추가 요청을 거부한다', async () => {
    const response = await fetch('http://localhost:8080/api/cart/items', {
      body: JSON.stringify({
        productId: PRODUCT_COMMERCE_MOCK_IDS['organic-broccoli'],
        quantity: 1,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    expect(response.status).toBe(409);
  });
});
