import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { useRecipesQueryMock, useRecipeRecommendationsQueryMock, useAuthSessionMock } = vi.hoisted(
  () => ({
    useRecipesQueryMock: vi.fn(),
    useRecipeRecommendationsQueryMock: vi.fn(),
    useAuthSessionMock: vi.fn(),
  }),
);

vi.mock('@/entities/recipe/api/use-recipes-query', () => ({
  useRecipesQuery: useRecipesQueryMock,
}));
vi.mock('@/entities/recipe/api/use-recipe-recommendations-query', () => ({
  useRecipeRecommendationsQuery: useRecipeRecommendationsQueryMock,
}));
vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock('@/shared/ui/back-button', () => ({ BackButton: () => null }));
vi.mock('@/widgets/navigation/ui/bottom-navigation', () => ({ BottomNavigation: () => null }));
vi.mock('./recipe-list-page', () => ({
  RecipeCard: ({
    recipe,
    recommendationContext,
  }: {
    recipe: { name: string };
    recommendationContext?: { requestId?: string | null; position?: number };
  }) => (
    <div
      data-position={recommendationContext?.position}
      data-request-id={recommendationContext?.requestId}
    >
      {recipe.name}
    </div>
  ),
  getRecipeRecommendationTitle: (source: 'AI' | 'POPULARITY') =>
    source === 'AI' ? '팬트리 기반 추천' : '인기 레시피',
  getRecipeRecommendationSectionCopy: (
    variant: 'pantry' | 'personalized',
    source: 'AI' | 'POPULARITY',
  ) => ({
    description:
      variant === 'personalized'
        ? source === 'AI'
          ? '맛 선호도를 반영해 AI가 추천했어요.'
          : '지금 인기 있는 레시피를 추천해요.'
        : '팬트리 기반 추천',
  }),
}));

import { recipeMocks } from '@/entities/recipe/model/mock';

import { RecipeMorePage } from './recipe-more-page';

describe('RecipeMorePage', () => {
  beforeEach(() => {
    useRecipesQueryMock.mockReset();
    useRecipeRecommendationsQueryMock.mockReset();
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useRecipeRecommendationsQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });
  });

  it('shows loading instead of recipe mocks while the API request is pending', () => {
    useRecipesQueryMock.mockReturnValue({ data: undefined, error: null, isPending: true });
    const markup = renderToStaticMarkup(<RecipeMorePage />);

    expect(markup).toContain('레시피를 불러오는 중입니다.');
    expect(markup).not.toContain(recipeMocks[0].name);
  });

  it('renders the API results under the generic API-supported title', () => {
    const apiRecipe = { ...recipeMocks[0], name: 'API에서 가져온 레시피' };
    useRecipesQueryMock.mockReturnValue({
      data: { content: [apiRecipe], totalElements: 1, totalPages: 1 },
      error: null,
      isPending: false,
    });
    const markup = renderToStaticMarkup(<RecipeMorePage />);

    expect(markup).toContain('전체 레시피');
    expect(markup).toContain('API에서 가져온 레시피');
    expect(markup).not.toContain('1위');
  });

  it('shows the common error screen instead of API-independent fallback content', () => {
    useRecipesQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('failed'),
      isPending: false,
      refetch: vi.fn(),
    });
    const markup = renderToStaticMarkup(<RecipeMorePage />);

    expect(markup).toContain('레시피를 불러오지 못했어요');
    expect(markup).not.toContain(recipeMocks[0].name);
  });

  it('loads up to one hundred recommendations and paginates them ten per page', () => {
    const items = Array.from({ length: 11 }, (_, index) => ({
      rank: index + 1,
      reason: null,
      coverage: null,
      missingCount: null,
      missingIngredients: [],
      recipe: {
        recipeId: index + 1,
        title: `추천 ${index + 1}`,
        description: '',
        cuisineType: 'KOREAN' as const,
        cookingTime: 20,
        servings: 2,
        difficulty: 'EASY' as const,
      },
    }));
    useRecipeRecommendationsQueryMock.mockReturnValue({
      data: { requestId: 'recommendation-1', source: 'AI', items },
      error: null,
      isPending: false,
      isError: false,
      refetch: vi.fn(),
    });
    useRecipesQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });

    const markup = renderToStaticMarkup(<RecipeMorePage sectionId="recommendations" />);

    expect(useRecipeRecommendationsQueryMock).toHaveBeenCalledWith(true, 100, true);
    expect(useRecipesQueryMock).toHaveBeenCalledWith(
      { page: 0, size: 20, ingredientIds: [] },
      false,
    );
    expect(markup).toContain('팬트리 기반 추천');
    expect(markup).toContain('1 / 2');
    expect(markup).toContain('추천 10');
    expect(markup).not.toContain('추천 11');
  });

  it('나를 위한 레시피 더보기에서 팬트리를 제외한 추천을 조회한다', () => {
    useRecipeRecommendationsQueryMock.mockReturnValue({
      data: {
        requestId: 'taste-request',
        source: 'AI',
        items: [
          {
            rank: 1,
            reason: '맛 선호도 기반',
            coverage: null,
            missingCount: null,
            missingIngredients: [],
            recipe: {
              recipeId: 71,
              title: '나를 위한 추천',
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
    useRecipesQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });

    const markup = renderToStaticMarkup(<RecipeMorePage sectionId="personalized" />);

    expect(useRecipeRecommendationsQueryMock).toHaveBeenCalledWith(true, 100, false);
    expect(markup).toContain('나를 위한 레시피');
    expect(markup).toContain('나를 위한 추천');
    expect(markup).toContain('data-request-id="taste-request"');
    expect(markup).toContain('data-position="1"');
  });

  it('개인화 추천이 인기 fallback이면 AI 문구 대신 인기 안내를 표시한다', () => {
    useRecipeRecommendationsQueryMock.mockReturnValue({
      data: {
        requestId: null,
        source: 'POPULARITY',
        items: [
          {
            rank: 1,
            reason: null,
            coverage: null,
            missingCount: null,
            missingIngredients: [],
            recipe: {
              recipeId: 81,
              title: '인기 추천',
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
    useRecipesQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });

    const markup = renderToStaticMarkup(<RecipeMorePage sectionId="personalized" />);

    expect(markup).toContain('지금 인기 있는 레시피를 추천해요.');
    expect(markup).not.toContain('맛 선호도를 반영해 AI가 추천했어요.');
  });

  it('개인화 추천 재조회가 실패해도 기존 카드를 유지한다', () => {
    useRecipeRecommendationsQueryMock.mockReturnValue({
      data: {
        requestId: 'stale-request',
        source: 'AI',
        items: [
          {
            rank: 1,
            reason: '맛 선호도 기반',
            coverage: null,
            missingCount: null,
            missingIngredients: [],
            recipe: {
              recipeId: 91,
              title: '기존 추천',
              description: '',
              cuisineType: 'KOREAN',
              cookingTime: 20,
              servings: 2,
              difficulty: 'EASY',
            },
          },
        ],
      },
      error: new Error('refetch failed'),
      isPending: false,
      isError: true,
      refetch: vi.fn(),
    });
    useRecipesQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });

    const markup = renderToStaticMarkup(<RecipeMorePage sectionId="personalized" />);

    expect(markup).toContain('기존 추천');
    expect(markup).toContain('최신 추천을 불러오지 못했어요.');
    expect(markup).toContain('다시 시도');
  });

  it('게스트가 로그인하면 개인화 더보기로 복귀한다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'guest' });
    useRecipesQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });

    const markup = renderToStaticMarkup(<RecipeMorePage sectionId="personalized" />);

    expect(markup).toContain('href="/login?returnTo=%2Frecipe%2Fmore%3Fsection%3Dpersonalized"');
  });
});
