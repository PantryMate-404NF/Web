import { describe, expect, it } from 'vitest';

import { pantryItems } from '@/entities/pantry/model/mock';
import type { Recipe } from '@/entities/recipe/model/types';

import {
  filterRecipesByQuery,
  getRecipeDisplayMode,
  getImminentIngredients,
  getIngredientSelectionRoute,
  getRecipeContentMode,
  getRecipeMoreRoute,
  getRecipeSectionById,
  getRecipeViewState,
  getRecipeSearchResultDisplay,
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
    expect(getIngredientSelectionRoute()).toBe('/recipe/ingredients');
    expect(getRecipeMoreRoute('all')).toBe('/recipe/more?section=all');
    expect(getRecipeSectionById('popular', recipes).title).toBe('전체 레시피');
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
});
