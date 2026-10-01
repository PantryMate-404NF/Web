import { describe, expect, it } from 'vitest';

import { pantryItems } from '@/entities/pantry/model/mock';
import type { Recipe } from '@/entities/recipe/model/types';
import { getRecipeResultsHref } from '@/views/pantry/ui/pantry-page';

import {
  getAvailablePantryIngredients,
  filterRecipesByQuery,
  getRecipeDisplayMode,
  getImminentIngredients,
  getImminentPantryItemIds,
  getIngredientSelectionRoute,
  getRecipeContentMode,
  getRecipeMoreRoute,
  getRecipeSectionById,
  getRecipeViewState,
  getRecipeSearchResultDisplay,
  getRecipeSearchPagination,
  getRecipeSearchPageNumbers,
  getRecipeSections,
  RECIPE_SEARCH_EMPTY_COPY,
  RECIPE_RAIL_TYPOGRAPHY,
} from './recipe-list-page';

const recipes: Recipe[] = [
  {
    id: 'stew-1',
    name: '김치찌개',
    category: '한식',
    cookTime: '30분',
    description: '얼큰한 찌개',
    thumbnailUrl: 'https://cdn.example.test/kimchi.jpg',
    cookingSteps: [],
    missingCount: 0,
    ingredients: [],
    linkedProducts: [],
  },
];

describe('recipe list helpers', () => {
  it('shows only the search screen while a non-empty query is entered', () => {
    expect(getRecipeContentMode('달걀')).toBe('search');
    expect(getRecipeContentMode('   ')).toBe('list');
  });

  it('uses the empty-search copy when no recipe matches the query', () => {
    expect(getRecipeSearchResultDisplay([])).toBe('empty');
    expect(RECIPE_SEARCH_EMPTY_COPY).toEqual({
      title: '검색 결과가 없어요.',
      descriptionLines: ['다른 검색어를 입력하거나', '맞춤법을 확인해보세요'],
    });
  });

  it('exposes previous and next availability for a paginated search result', () => {
    expect(getRecipeSearchPagination(0, 35)).toEqual({
      currentPage: 1,
      totalPages: 35,
      canGoPrevious: false,
      canGoNext: true,
    });
    expect(getRecipeSearchPagination(34, 35)).toEqual({
      currentPage: 35,
      totalPages: 35,
      canGoPrevious: true,
      canGoNext: false,
    });
  });

  it('shows five numbered pages in the current group, including the last partial group', () => {
    expect(getRecipeSearchPageNumbers(0, 35)).toEqual([1, 2, 3, 4, 5]);
    expect(getRecipeSearchPageNumbers(5, 35)).toEqual([6, 7, 8, 9, 10]);
    expect(getRecipeSearchPageNumbers(34, 35)).toEqual([31, 32, 33, 34, 35]);
    expect(getRecipeSearchPageNumbers(0, 0)).toEqual([]);
  });

  it('prioritizes an API failure over recipe content', () => {
    expect(getRecipeViewState(new Error('레시피 조회 실패'))).toBe('error');
    expect(getRecipeViewState(null)).toBe('content');
  });

  it('filters real API recipes by a trimmed, case-insensitive name query', () => {
    expect(filterRecipesByQuery(recipes, '  김치찌개 ')).toEqual([recipes[0]]);
    expect(filterRecipesByQuery(recipes, '')).toEqual(recipes);
  });

  it('uses the pantry layout only when at least one pantry item is registered', () => {
    expect(getRecipeDisplayMode([])).toBe('basic');
    expect(getRecipeDisplayMode(pantryItems)).toBe('pantry');
  });

  it('uses the Figma title and description typography for recipe rails', () => {
    expect(RECIPE_RAIL_TYPOGRAPHY).toEqual({
      descriptionClassName:
        'truncate text-[15px] leading-[1.5] font-medium text-[var(--primitive-grey-500)]',
      titleClassName: 'text-title-3 font-semibold',
    });
  });

  it('routes ingredient cards and the only API-supported recipe list', () => {
    expect(getIngredientSelectionRoute()).toBe('/pantry');
    expect(getRecipeMoreRoute('all')).toBe('/recipe/more?section=all');
    expect(getRecipeMoreRoute('recommendations')).toBe('/recipe/more?section=recommendations');
    expect(getRecipeSectionById('popular', recipes).title).toBe('전체 레시피');
  });

  it('keeps selected pantry item IDs in the return route while ingredient IDs are unresolved', () => {
    expect(getRecipeResultsHref([8, 8], ['egg', 'mushroom', 'bacon'])).toBe(
      '/recipe?ingredientIds=8&pantryItemIds=egg&pantryItemIds=mushroom&pantryItemIds=bacon',
    );
  });

  it('does not claim ranking categories or fabricate ranked recipe subsets', () => {
    const sections = getRecipeSections(recipes);
    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe('전체 레시피');
    expect(sections[0].recipes).toEqual(recipes);
  });

  it('shows up to three registered, available imminent pantry ingredients in expiry order', () => {
    expect(getImminentIngredients(pantryItems)).toEqual([{ name: '바나나', daysLeft: 2 }]);
  });

  it('uses the three soonest available imminent pantry items for recipe lookup', () => {
    const imminentItems = [
      { ...pantryItems[6]!, id: 'later', daysUntilExpiration: 4 },
      { ...pantryItems[6]!, id: 'soonest', daysUntilExpiration: 1 },
      { ...pantryItems[6]!, id: 'middle', daysUntilExpiration: 2 },
      { ...pantryItems[6]!, id: 'fourth', daysUntilExpiration: 5 },
      { ...pantryItems[7]!, id: 'expired' },
      { ...pantryItems[6]!, id: 'unavailable', availability: 'UNAVAILABLE' as const },
      { ...pantryItems[6]!, id: 'no-expiry', daysUntilExpiration: null },
    ];

    expect(getImminentPantryItemIds(imminentItems)).toEqual(['soonest', 'middle', 'later']);
  });

  it('shows only the selected pantry ingredients in the recipe header', () => {
    const items = pantryItems.map((item, index) => ({ ...item, ingredientId: index + 1 }));
    const ingredients = getAvailablePantryIngredients(items, [2]);

    expect(ingredients).toEqual([
      {
        name: items[1].name,
        daysLeft: items[1].daysUntilExpiration,
      },
    ]);
  });

  it('uses the recipe ingredient catalog to label selected pantry entries with no pantry ingredient ID', () => {
    const ingredients = getAvailablePantryIngredients(
      [{ ...pantryItems[0], ingredientId: null }],
      [91],
      [
        {
          ingredientId: 91,
          name: '설탕',
          expiryDate: '2027-01-14',
          expired: false,
          defaultSelected: false,
        },
      ],
    );

    expect(ingredients).toEqual([{ name: '설탕', daysLeft: 122 }]);
  });

  it('shows every selected pantry item in its original selection order before IDs resolve', () => {
    const items = pantryItems.map((item) => ({ ...item, ingredientId: null }));
    const selectedIds = [items[2]!.id, items[0]!.id, items[1]!.id];

    expect(getAvailablePantryIngredients(items, [], [], selectedIds)).toEqual(
      selectedIds.map((id) => {
        const selected = items.find((item) => item.id === id)!;
        return { name: selected.name, daysLeft: selected.daysUntilExpiration };
      }),
    );
  });

  it('keeps selected ingredients in the recipe header even when pantry marks them unavailable', () => {
    expect(
      getAvailablePantryIngredients(
        [{ ...pantryItems[0], ingredientId: 88, availability: 'UNAVAILABLE' }],
        [88],
      ),
    ).toEqual([{ name: '설탕', daysLeft: 122 }]);
  });
});
