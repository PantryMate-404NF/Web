import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  useScrappedRecipesQueryMock,
  useRecipeMutationsMock,
  useRecipesQueryMock,
  usePantriesQueryMock,
  useRecipeSearchQueryMock,
} = vi.hoisted(() => ({
  useScrappedRecipesQueryMock: vi.fn(),
  useRecipeMutationsMock: vi.fn(),
  useRecipesQueryMock: vi.fn(),
  usePantriesQueryMock: vi.fn(),
  useRecipeSearchQueryMock: vi.fn(),
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
} from './recipe-list-page';

describe('RecipeActionIcon', () => {
  beforeEach(() => {
    useScrappedRecipesQueryMock.mockReturnValue({ data: [], isPending: false, isError: false });
    useRecipesQueryMock.mockReturnValue({
      data: { content: [recipeMocks[0]], totalElements: 1 },
      isPending: false,
    });
    useRecipeSearchQueryMock.mockReturnValue({ data: undefined, isPending: false, error: null });
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
    expect(markup).toContain('보유 재료 기반 추천은 아직 제공되지 않아요.');
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
