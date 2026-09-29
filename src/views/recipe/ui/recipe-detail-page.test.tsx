import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  useCartQueryMock,
  useRecipeDetailQueryMock,
  useRecipeProductMatchQueryMock,
  useScrappedRecipesQueryMock,
} = vi.hoisted(() => ({
  useCartQueryMock: vi.fn(),
  useRecipeDetailQueryMock: vi.fn(),
  useRecipeProductMatchQueryMock: vi.fn(),
  useScrappedRecipesQueryMock: vi.fn(),
}));

vi.mock('@/entities/recipe/api/use-recipe-detail-query', () => ({
  useRecipeDetailQuery: useRecipeDetailQueryMock,
}));

vi.mock('@/entities/recipe/api/use-scrapped-recipes-query', () => ({
  useScrappedRecipesQuery: useScrappedRecipesQueryMock,
}));

vi.mock('@/entities/cart/api/use-cart-query', () => ({ useCartQuery: useCartQueryMock }));
vi.mock('@/entities/recipe/api/use-recipe-product-match-query', () => ({
  useRecipeProductMatchQuery: useRecipeProductMatchQueryMock,
}));
vi.mock('@/features/auth/ui/auth-session-provider', () => ({
  useAuthSession: () => ({ state: 'complete' }),
}));

vi.mock('@/features/recipe-cart/ui/recipe-cart-actions', () => ({
  RecipeCartActions: () => <div>레시피 재료 장바구니 동작</div>,
}));

vi.mock('@/shared/config/cart-write-mode', () => ({
  CART_HREF: '/cart',
  CART_WRITE_MODE: 'api',
}));

import {
  COOKING_GUIDE_DELAY_MS,
  COOKING_GUIDE_VISIBLE_MS,
  RecipeDetailPage,
  areAllIngredientsSelected,
  toggleIngredientSelection,
} from './recipe-detail-page';

describe('RecipeDetailPage', () => {
  beforeEach(() => {
    useScrappedRecipesQueryMock.mockReturnValue({ data: [], isPending: false });
    useRecipeProductMatchQueryMock.mockReturnValue({
      data: { ingredients: [] },
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
    useCartQueryMock.mockReturnValue({
      data: {
        cartId: 10,
        items: [
          {
            id: 'cart-item-5',
            cartItemId: 5,
            ingredient: '기본 옵션',
            name: '양파',
            price: 3900,
            productId: 101,
            quantity: 4,
            purchasable: true,
          },
        ],
      },
      isPending: false,
    });
    useRecipeDetailQueryMock.mockReturnValue({
      data: {
        id: '42',
        name: 'API 토마토 볶음',
        category: '중식',
        cookTime: '15분',
        description: '서버 설명',
        thumbnailUrl: 'https://cdn.example.test/recipe.jpg',
        cookingSteps: ['1단계 API 조리 설명', '2단계 API 조리 설명'],
        missingCount: 0,
        ingredients: [{ id: '3', name: '양파', amount: '2개' }],
        linkedProducts: [],
        servings: 3,
        difficulty: 'EASY',
        steps: [
          { number: 1, description: '1단계 API 조리 설명', imageUrl: null },
          {
            number: 2,
            description: '2단계 API 조리 설명',
            imageUrl: 'https://cdn.example.test/step.jpg',
          },
        ],
      },
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
  });

  it('요청한 recipe ID의 API 상세와 조리 순서를 렌더링한다', () => {
    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <RecipeDetailPage recipeId="42" />
      </QueryClientProvider>,
    );

    expect(useRecipeDetailQueryMock).toHaveBeenCalledWith('42', undefined);
    expect(useRecipeProductMatchQueryMock).toHaveBeenCalledWith('42');
    expect(useCartQueryMock).toHaveBeenCalledWith(true);
    expect(markup).toContain('API 토마토 볶음');
    expect(markup).toContain('서버 설명');
    expect(markup).toContain('3인분');
    expect(markup).toContain('양파');
    expect(markup).toContain('2개');
    expect(markup).toContain('1단계 API 조리 설명');
    expect(markup).toContain('2단계 API 조리 설명');
    expect(markup).toContain('필요 재료');
    expect(markup).toContain('조리 순서');
    expect(markup).toContain('조리 완료');
    expect(markup).toContain('href="/cart"');
    expect(markup).toContain('aria-label="장바구니 4개 상품"');
    expect(markup).toContain('https://cdn.example.test/recipe.jpg');
    expect(markup).toContain('https://cdn.example.test/step.jpg');
    expect(markup).not.toContain('토마토 달걀 볶음');
  });

  it('상세 조회 중에는 목업 내용을 렌더링하지 않는다', () => {
    useRecipeDetailQueryMock.mockReturnValue({ data: undefined, error: null, isPending: true });
    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <RecipeDetailPage recipeId="42" />
      </QueryClientProvider>,
    );

    expect(markup).toContain('role="status"');
    expect(markup).not.toContain('토마토 달걀 볶음');
    expect(markup).not.toContain('필요 재료');
  });

  it('상세 조회가 실패하면 목업 대신 재시도 가능한 오류 화면을 보여준다', () => {
    useRecipeDetailQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('not found'),
      isPending: false,
      refetch: vi.fn(),
    });
    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <RecipeDetailPage recipeId="missing-id" />
      </QueryClientProvider>,
    );

    expect(markup).toContain('레시피를 불러오지 못했어요');
    expect(markup).not.toContain('API 토마토 볶음');
    expect(markup).not.toContain('토마토 달걀 볶음');
  });

  it('스크랩 버튼 상태를 브라우저 저장소가 아니라 서버 스크랩 목록에서 가져온다', () => {
    useScrappedRecipesQueryMock.mockReturnValue({ data: [{ id: '42' }], isPending: false });
    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <RecipeDetailPage recipeId="42" />
      </QueryClientProvider>,
    );

    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('aria-label="레시피 스크랩 해제"');
  });
});

describe('ingredient selection', () => {
  it('toggles one ingredient and can identify a fully selected ingredient list', () => {
    expect(toggleIngredientSelection([], 'tomato')).toEqual(['tomato']);
    expect(toggleIngredientSelection(['tomato'], 'tomato')).toEqual([]);
    expect(areAllIngredientsSelected(['tomato', 'egg'], ['tomato', 'egg'])).toBe(true);
    expect(areAllIngredientsSelected(['tomato'], ['tomato', 'egg'])).toBe(false);
  });
});

describe('cooking guide timing', () => {
  it('uses a positive delay and keeps the guide visible for ten seconds', () => {
    expect(COOKING_GUIDE_DELAY_MS).toBeGreaterThan(0);
    expect(COOKING_GUIDE_VISIBLE_MS).toBe(10_000);
  });
});
