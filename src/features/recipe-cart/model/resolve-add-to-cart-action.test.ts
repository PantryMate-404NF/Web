import { describe, expect, it } from 'vitest';

import { resolveAddToCartAction } from './resolve-add-to-cart-action';

describe('resolveAddToCartAction', () => {
  it('shows an unavailable state when no linked products exist', () => {
    expect(resolveAddToCartAction(0)).toBe('unavailable');
  });

  it('directly adds the only linked product', () => {
    expect(resolveAddToCartAction(1)).toBe('direct-add');
  });

  it('opens the product selection sheet when multiple products are linked', () => {
    expect(resolveAddToCartAction(4)).toBe('open-bottom-sheet');
  });
});
