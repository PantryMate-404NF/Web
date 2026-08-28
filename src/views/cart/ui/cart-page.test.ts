import { describe, expect, it } from 'vitest';

import { getCartNotice } from './cart-page';

describe('getCartNotice', () => {
  it('explains that cart items originated from a recipe', () => {
    expect(getCartNotice('recipe')).toBe('레시피 부족 재료가 담겼어요');
  });

  it('uses the default notice without a recipe origin', () => {
    expect(getCartNotice()).toBe('장바구니에 담은 상품이에요');
  });
});
