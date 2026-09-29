import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const { addProductsMock, routerPushMock } = vi.hoisted(() => ({
  addProductsMock: vi.fn(),
  routerPushMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: routerPushMock }) }));
vi.mock('@/entities/cart/model/cart-store', () => ({
  useCartStore: (selector: (state: { addProducts: typeof addProductsMock }) => unknown) =>
    selector({ addProducts: addProductsMock }),
}));
vi.mock('@/features/product-cart/model/use-add-product-to-cart', () => ({
  useAddProductToCart: () => ({ addProduct: vi.fn() }),
}));
vi.mock('@/features/auth/ui/auth-session-provider', () => ({
  useAuthSession: () => ({ restore: vi.fn(), state: 'complete' }),
}));
vi.mock('@/shared/config/cart-write-mode', () => ({
  CART_HREF: '/cart?preview=local',
  CART_WRITE_MODE: 'preview',
}));

import { RecipeCartActions } from './recipe-cart-actions';

describe('RecipeCartActions', () => {
  it('shows selection first with the Grey-200 outline, followed by the shortage action', () => {
    const markup = renderToStaticMarkup(
      createElement(RecipeCartActions, {
        ingredients: [
          {
            id: 'onion',
            name: '양파',
            amount: '1개',
            isOwned: false,
            mappedProduct: {
              productId: 101,
              productName: '국내산 양파',
              price: 3900,
              quantity: 1,
            },
          },
        ],
        returnTo: '/recipe/42',
        selectedIngredientIds: ['onion'],
      }),
    );

    expect(markup.indexOf('선택 담기')).toBeLessThan(markup.indexOf('부족 재료 담기'));
    expect(markup).toContain('border-[var(--primitive-grey-200)]');
  });

  it('keeps both add actions enabled for selected ingredients without linked products in preview mode', () => {
    const markup = renderToStaticMarkup(
      createElement(RecipeCartActions, {
        ingredients: [{ id: 'salt', name: '소금', amount: '약간', mappedProduct: null }],
        returnTo: '/recipe/42',
        selectedIngredientIds: ['salt'],
      }),
    );

    const buttonMarkup = markup.match(/<button[^>]*>.*?<\/button>/g) ?? [];
    expect(buttonMarkup).toHaveLength(2);
    expect(buttonMarkup.every((button) => !button.includes('disabled=""'))).toBe(true);
  });
});
