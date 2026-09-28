import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { useRecipesQueryMock } = vi.hoisted(() => ({ useRecipesQueryMock: vi.fn() }));

vi.mock('@/entities/recipe/api/use-recipes-query', () => ({
  useRecipesQuery: useRecipesQueryMock,
}));
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock('@/shared/ui/back-button', () => ({ BackButton: () => null }));
vi.mock('@/widgets/navigation/ui/bottom-navigation', () => ({ BottomNavigation: () => null }));
vi.mock('./recipe-list-page', () => ({
  RecipeCard: ({ recipe }: { recipe: { name: string } }) => <div>{recipe.name}</div>,
}));

import { recipeMocks } from '@/entities/recipe/model/mock';

import { RecipeMorePage } from './recipe-more-page';

describe('RecipeMorePage', () => {
  beforeEach(() => {
    useRecipesQueryMock.mockReset();
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
});
