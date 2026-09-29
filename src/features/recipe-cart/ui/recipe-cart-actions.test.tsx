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
        productMatches: [
          {
            ingredientId: 11,
            name: '양파',
            hasIngredient: false,
            matchStatus: 'MATCHED',
            product: { productId: 101, name: '국내산 양파', price: 3900 },
          },
        ],
        isProductMatchPending: false,
        isProductMatchError: false,
        onRetryProductMatch: vi.fn(),
        returnTo: '/recipe/42',
        selectedIngredientIds: ['11'],
      }),
    );

    expect(markup.indexOf('선택 담기')).toBeLessThan(markup.indexOf('부족 재료 담기'));
    expect(markup).toContain('border-[var(--primitive-grey-200)]');
  });

  it('keeps both add actions enabled for selected ingredients without linked products in preview mode', () => {
    const markup = renderToStaticMarkup(
      createElement(RecipeCartActions, {
        productMatches: [
          { ingredientId: 15, name: '소금', hasIngredient: false, matchStatus: 'UNSUPPORTED' },
        ],
        isProductMatchPending: false,
        isProductMatchError: false,
        onRetryProductMatch: vi.fn(),
        returnTo: '/recipe/42',
        selectedIngredientIds: ['15'],
      }),
    );

    const buttonMarkup = markup.match(/<button[^>]*>.*?<\/button>/g) ?? [];
    expect(buttonMarkup).toHaveLength(2);
    expect(buttonMarkup.every((button) => !button.includes('disabled=""'))).toBe(true);
  });

  it('does not report missing mappings while product matches are loading', () => {
    const markup = renderToStaticMarkup(
      createElement(RecipeCartActions, {
        productMatches: [],
        isProductMatchPending: true,
        isProductMatchError: false,
        onRetryProductMatch: vi.fn(),
        returnTo: '/recipe/42',
        selectedIngredientIds: [],
      }),
    );

    expect(markup).toContain('상품 정보를 확인하고 있어요.');
    expect(markup).not.toContain('연동 상품이 없어요.');
  });

  it('distinguishes having no shortages from having no product mapping', () => {
    const markup = renderToStaticMarkup(
      createElement(RecipeCartActions, {
        productMatches: [
          {
            ingredientId: 11,
            name: '양파',
            hasIngredient: true,
            matchStatus: 'MATCHED',
            product: { productId: 101, name: '국내산 양파', price: 3900 },
          },
        ],
        isProductMatchPending: false,
        isProductMatchError: false,
        onRetryProductMatch: vi.fn(),
        returnTo: '/recipe/42',
        selectedIngredientIds: [],
      }),
    );

    expect(markup).toContain('부족한 재료가 없어요.');
    expect(markup).not.toContain('연동 상품이 없어요.');
  });
});
