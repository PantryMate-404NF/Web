import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  useScrappedRecipesQueryMock,
  useRecipeMutationsMock,
  useRecipesQueryMock,
  usePantriesQueryMock,
  useRecipeSearchQueryMock,
  useRecipeFilterIngredientsQueryMock,
  useRecipeRecommendationsQueryMock,
  useAuthSessionMock,
  useCartQueryMock,
} = vi.hoisted(() => ({
  useScrappedRecipesQueryMock: vi.fn(),
  useRecipeMutationsMock: vi.fn(),
  useRecipesQueryMock: vi.fn(),
  usePantriesQueryMock: vi.fn(),
  useRecipeSearchQueryMock: vi.fn(),
  useRecipeFilterIngredientsQueryMock: vi.fn(),
  useRecipeRecommendationsQueryMock: vi.fn(),
  useAuthSessionMock: vi.fn(),
  useCartQueryMock: vi.fn(),
}));

vi.mock('@/entities/recipe/api/use-scrapped-recipes-query', () => ({
  useScrappedRecipesQuery: useScrappedRecipesQueryMock,
}));

vi.mock('@/entities/recipe/api/use-recipe-mutations', () => ({
  useRecipeMutations: useRecipeMutationsMock,
}));

vi.mock('@/entities/recipe/api/use-recipes-query', () => ({
  useRecipesQuery: useRecipesQueryMock,
}));
vi.mock('@/entities/recipe/api/use-recipe-search-query', () => ({
  useRecipeSearchQuery: useRecipeSearchQueryMock,
}));
vi.mock('@/entities/recipe/api/use-recipe-filter-ingredients-query', () => ({
  useRecipeFilterIngredientsQuery: useRecipeFilterIngredientsQueryMock,
}));
vi.mock('@/entities/recipe/api/use-recipe-recommendations-query', () => ({
  useRecipeRecommendationsQuery: useRecipeRecommendationsQueryMock,
}));
vi.mock('@/shared/config/cart-write-mode', () => ({
  CART_HREF: '/cart',
  CART_WRITE_MODE: 'api',
}));
vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('@/entities/cart/api/use-cart-query', () => ({ useCartQuery: useCartQueryMock }));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));

vi.mock('@/entities/pantry/api/use-pantries-query', () => ({
  usePantriesQuery: usePantriesQueryMock,
}));

vi.mock('@/widgets/navigation/ui/bottom-navigation', () => ({
  BottomNavigation: () => null,
}));

import { recipeMocks } from '@/entities/recipe/model/mock';

import {
  ImminentIngredientChips,
  RECIPE_ACTION_LAYOUT,
  RecipeActionIcon,
  RecipeCard,
  RecipeListPage,
  RecipeSearchPagination,
  RecipeRecommendationsSection,
  RECIPE_PANTRY_DIVIDER_CLASS,
  getRecipeRecommendationTitle,
} from './recipe-list-page';

describe('RecipeActionIcon', () => {
  beforeEach(() => {
    useScrappedRecipesQueryMock.mockReturnValue({ data: [], isPending: false, isError: false });
    useRecipesQueryMock.mockReturnValue({
      data: { content: [recipeMocks[0]], totalElements: 1 },
      isPending: false,
    });
    useRecipeSearchQueryMock.mockReturnValue({ data: undefined, isPending: false, error: null });
    useRecipeFilterIngredientsQueryMock.mockReturnValue({ data: [] });
    useRecipeRecommendationsQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });
    useAuthSessionMock.mockReturnValue({ state: 'guest' });
    useCartQueryMock.mockReturnValue({ data: { items: [] } });
    usePantriesQueryMock.mockReturnValue({ data: [] });
    useRecipeMutationsMock.mockReturnValue({
      scrap: { mutateAsync: vi.fn(), isPending: false },
      unscrap: { mutateAsync: vi.fn(), isPending: false },
    });
  });

  it('renders a server-backed bookmark action on each recipe card', () => {
    const markup = renderToStaticMarkup(<RecipeCard recipe={recipeMocks[0]} />);

    expect(markup).toContain('lucide-bookmark');
    expect(markup).toContain('aria-label="레시피 스크랩"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain('<button');
    expect(markup).toContain('right-2.5');
    expect(markup).toContain('bg-card/80');
  });

  it('shows the total cart quantity beside the recipe list cart icon', () => {
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useCartQueryMock.mockReturnValue({ data: { items: [{ quantity: 9 }] } });
    const markup = renderToStaticMarkup(<RecipeListPage />);

    expect(useCartQueryMock).toHaveBeenCalledWith(true);
    expect(markup).toContain('aria-label="장바구니 9개 상품"');
    expect(markup).toContain('>9</span>');
    expect(markup).toContain('href="/cart"');
  });

  it('renders search pagination with the current page and correct boundary buttons', () => {
    const markup = renderToStaticMarkup(
      <RecipeSearchPagination page={0} totalPages={35} onPageChange={vi.fn()} />,
    );

    expect(markup).toContain('aria-label="레시피 검색 페이지"');
    expect(markup).toContain('1 / 35');
    expect(markup).toContain('aria-label="이전 페이지" disabled=""');
    expect(markup).toContain('aria-label="다음 페이지"');
    expect(markup).not.toContain('aria-label="다음 페이지" disabled=""');
  });

  it('requests the first search result page in batches of twenty', () => {
    renderToStaticMarkup(<RecipeListPage />);

    expect(useRecipeSearchQueryMock).toHaveBeenCalledWith('', 0, 20);
  });

  it('fills the list bookmark when the server scrap list contains that recipe', () => {
    useScrappedRecipesQueryMock.mockReturnValue({
      data: [recipeMocks[0]],
      isPending: false,
      isError: false,
    });
    const markup = renderToStaticMarkup(<RecipeCard recipe={recipeMocks[0]} />);

    expect(markup).toContain('aria-label="레시피 스크랩 해제"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('fill="var(--primitive-primary-700)"');
  });

  it('renders the API thumbnail and does not substitute the mock food image', () => {
    const apiRecipe = { ...recipeMocks[0], thumbnailUrl: 'https://cdn.example.test/recipe.jpg' };
    useRecipesQueryMock.mockReturnValue({
      data: { content: [apiRecipe], totalElements: 1 },
      isPending: false,
    });
    const markup = renderToStaticMarkup(<RecipeListPage />);

    expect(markup).toContain('src="https://cdn.example.test/recipe.jpg"');
    expect(markup).not.toContain('/images/delivery/antibiotic-free-eggs.png');
    expect(markup).not.toContain('1위');
  });

  it('shows selected ingredient recipes before the grey-100 divider in one pantry block', () => {
    const pantryItem = { ...recipeMocks[0], id: 'selected-recipe', name: '선택 재료 레시피' };
    const generalRecipe = { ...recipeMocks[0], id: 'general-recipe', name: '전체 레시피' };
    usePantriesQueryMock.mockReturnValue({
      data: [
        {
          id: 'egg-item',
          name: '계란',
          ingredientId: 11,
          daysUntilExpiration: 2,
          availability: 'AVAILABLE',
          expirationStatus: 'IMMINENT',
          expirationLabel: 'D-2',
          imageAlt: '계란',
        },
      ],
    });
    useRecipesQueryMock
      .mockReturnValueOnce({ data: { content: [pantryItem], totalElements: 1 }, isPending: false })
      .mockReturnValueOnce({
        data: { content: [generalRecipe], totalElements: 1 },
        isPending: false,
      });

    const markup = renderToStaticMarkup(
      <RecipeListPage selectedIngredientIds={[11]} selectedPantryItemIds={['egg-item']} />,
    );

    const ingredientPosition = markup.indexOf('계란');
    const recipePosition = markup.indexOf(pantryItem.name);
    const dividerPosition = markup.indexOf(RECIPE_PANTRY_DIVIDER_CLASS);
    expect(ingredientPosition).toBeGreaterThanOrEqual(0);
    expect(recipePosition).toBeGreaterThan(ingredientPosition);
    expect(dividerPosition).toBeGreaterThan(recipePosition);
    expect(markup).toContain('class="flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1"');
    expect(markup.indexOf(generalRecipe.name)).toBeGreaterThan(dividerPosition);
    expect(RECIPE_PANTRY_DIVIDER_CLASS).toBe('h-2 w-full bg-[var(--primitive-grey-100)]');
  });

  it('renders recommendation title, copy, and more link while preserving server rank order', () => {
    const first = { ...recipeMocks[0], id: '42', name: '첫 번째 추천' };
    const second = { ...recipeMocks[0], id: '43', name: '두 번째 추천' };
    const markup = renderToStaticMarkup(
      <RecipeRecommendationsSection
        authState="complete"
        data={{
          source: 'AI',
          requestId: 'rec-123',
          items: [
            {
              rank: 1,
              reason: '팬트리 재료를 사용해요',
              coverage: 1,
              missingCount: 0,
              missingIngredients: [],
              recipe: {
                recipeId: 42,
                title: first.name,
                description: '',
                cuisineType: 'KOREAN',
                cookingTime: 20,
                servings: 2,
                difficulty: 'EASY',
              },
            },
            {
              rank: 2,
              reason: '두 번째 이유',
              coverage: 1,
              missingCount: 0,
              missingIngredients: [],
              recipe: {
                recipeId: 43,
                title: second.name,
                description: '',
                cuisineType: 'KOREAN',
                cookingTime: 20,
                servings: 2,
                difficulty: 'EASY',
              },
            },
          ],
        }}
        isPending={false}
        isError={false}
        onRetry={vi.fn()}
      />,
    );

    expect(markup).toContain('팬트리 기반 추천');
    expect(markup).not.toContain('팬트리 재료를 사용해요');
    expect(markup).toContain('팬트리 재료로 만들 수 있는 레시피를 확인해 보세요.');
    expect(markup).toContain('더보기');
    expect(markup).toContain('href="/recipe/more?section=recommendations"');
    expect(markup.indexOf(first.name)).toBeLessThan(markup.indexOf(second.name));
    expect(markup).toContain('href="/recipe/42?requestId=rec-123&amp;position=1"');
  });

  it('renders popularity fallback without AI reason copy and prompts guests to log in', () => {
    const popularityMarkup = renderToStaticMarkup(
      <RecipeRecommendationsSection
        authState="complete"
        data={{
          source: 'POPULARITY',
          requestId: null,
          items: [
            {
              rank: 1,
              reason: null,
              coverage: null,
              missingCount: null,
              missingIngredients: [],
              recipe: {
                recipeId: 42,
                title: '인기 레시피',
                description: '',
                cuisineType: 'KOREAN',
                cookingTime: 20,
                servings: 2,
                difficulty: 'EASY',
              },
            },
          ],
        }}
        isPending={false}
        isError={false}
        onRetry={vi.fn()}
      />,
    );
    const guestMarkup = renderToStaticMarkup(
      <RecipeRecommendationsSection
        authState="guest"
        isPending={false}
        isError={false}
        onRetry={vi.fn()}
      />,
    );

    expect(popularityMarkup).toContain('인기 레시피');
    expect(popularityMarkup).not.toContain('팬트리 재료를 사용해요');
    expect(popularityMarkup).toContain('href="/recipe/42"');
    expect(guestMarkup).toContain('로그인하고 추천 받기');
    expect(guestMarkup).toContain('href="/login?returnTo=%2Frecipe"');
    expect(getRecipeRecommendationTitle('POPULARITY')).toBe('인기 레시피');
  });

  it('shows the popularity fallback for an authenticated user with an empty pantry', () => {
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    usePantriesQueryMock.mockReturnValue({ data: [] });
    useRecipeRecommendationsQueryMock.mockReturnValue({
      data: {
        source: 'POPULARITY',
        requestId: null,
        items: [
          {
            rank: 1,
            reason: null,
            coverage: null,
            missingCount: null,
            missingIngredients: [],
            recipe: {
              recipeId: 42,
              title: '빈 팬트리 인기 레시피',
              description: '',
              cuisineType: 'KOREAN',
              cookingTime: 20,
              servings: 2,
              difficulty: 'EASY',
            },
          },
        ],
      },
      error: null,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<RecipeListPage />);

    expect(markup).toContain('인기 레시피');
    expect(markup).toContain('빈 팬트리 인기 레시피');
  });

  it('shows loading state instead of fallback recipes while the API is pending', () => {
    useRecipesQueryMock.mockReturnValue({ data: undefined, isPending: true });
    const markup = renderToStaticMarkup(<RecipeListPage />);

    expect(markup).toContain('레시피를 불러오는 중입니다.');
    expect(markup).not.toContain(recipeMocks[0].name);
  });

  it('renders an expiration-imminent alert card when the pantry has imminent ingredients', () => {
    const markup = renderToStaticMarkup(
      <ImminentIngredientChips ingredients={[{ name: '돼지고기', daysLeft: 5 }]} />,
    );

    expect(markup).toContain('돼지고기');
    expect(markup).toContain('D-5');
    expect(markup).toContain('기한 임박 식재료가 있어요!');
    expect(markup).toContain('팬트리메이트가 활용할 수 있는 레시피를 추천해 드릴게요.');
  });

  it('renders regular pantry ingredients as chips without the expiration-imminent alert', () => {
    const markup = renderToStaticMarkup(
      <ImminentIngredientChips
        ingredients={[{ name: '돼지고기', daysLeft: 5 }]}
        showAlert={false}
      />,
    );

    expect(markup).toContain('돼지고기');
    expect(markup).toContain('D-5');
    expect(markup).not.toContain('기한 임박 식재료가 있어요!');
    expect(markup).toContain('border-[var(--primitive-grey-300)]');
    expect(markup).toContain('bg-card');
  });

  it('renders the grey-600 chevron used by recipe action links', () => {
    const markup = renderToStaticMarkup(<RecipeActionIcon />);

    expect(markup).toContain('lucide-chevron-right');
    expect(markup).toContain('text-[var(--primitive-grey-600)]');
  });

  it('uses the Figma action area height and text-to-icon overlap', () => {
    expect(RECIPE_ACTION_LAYOUT.containerClassName).toContain('h-[60px]');
    expect(RECIPE_ACTION_LAYOUT.containerClassName).toContain('pb-5');
    expect(RECIPE_ACTION_LAYOUT.textClassName).toContain('-mr-1.5');
    expect(RECIPE_ACTION_LAYOUT.sectionHeaderClassName).toContain('-mr-4');
    expect(RECIPE_ACTION_LAYOUT.titleBlockClassName).toContain('h-12');
  });

  it('keeps the pantry recipe action in its own 40px header with an 8px panel gap', () => {
    expect(RECIPE_ACTION_LAYOUT.topHeaderClassName).toContain('h-10');
    expect(RECIPE_ACTION_LAYOUT.topActionClassName).not.toContain('pb-5');
    expect(RECIPE_ACTION_LAYOUT.topPanelClassName).toContain('mt-2');
  });
});
