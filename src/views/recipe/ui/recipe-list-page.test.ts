import { describe, expect, it } from 'vitest';

import { pantryItems } from '@/entities/pantry/model/mock';
import { recipeMocks } from '@/entities/recipe/model/mock';

import {
  filterRecipesByQuery,
  getPantryRecipeRecommendations,
  getRecipePantryItems,
  getRecipeDisplayMode,
  getImminentIngredients,
  getIngredientSelectionRoute,
  getRecipeRoute,
  getRecipeContentMode,
  getRecipeSearchResultDisplay,
  getRecipeSections,
  RECIPE_SEARCH_EMPTY_COPY,
  RECIPE_RAIL_TYPOGRAPHY,
} from './recipe-list-page';

describe('getRecipeSections', () => {
  it('shows only the search screen while a non-empty query is entered', () => {
    expect(getRecipeContentMode('달걀')).toBe('search');
    expect(getRecipeContentMode('   ')).toBe('list');
  });

  it('uses the empty-search copy when no recipe matches the query', () => {
    expect(getRecipeSearchResultDisplay([])).toBe('empty');
    expect(RECIPE_SEARCH_EMPTY_COPY).toEqual({
      title: '검색 결과가 없어요.',
      description: '다른 검색어를 입력하거나 맞춤법을 확인해 보세요.',
    });
  });

  it('filters recipes by a trimmed, case-insensitive recipe name query', () => {
    expect(filterRecipesByQuery(recipeMocks, '  김치찌개 ')).toEqual([recipeMocks[0]]);
    expect(filterRecipesByQuery(recipeMocks, '')).toEqual(recipeMocks);
  });

  it('uses five pantry fixtures with three imminent items when mock mode is requested', () => {
    const items = getRecipePantryItems([], 'imminent');

    expect(items).toHaveLength(5);
    expect(items.filter((item) => item.expirationStatus === 'IMMINENT')).toHaveLength(3);
  });

  it('uses registered pantry fixtures without imminent ingredients in normal mock mode', () => {
    const items = getRecipePantryItems([], 'normal');

    expect(items).toHaveLength(5);
    expect(items.filter((item) => item.expirationStatus === 'IMMINENT')).toHaveLength(0);
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

  it('keeps the expiration-imminent mock on its own route', () => {
    expect(getRecipeRoute('imminent')).toBe('/recipe/imminent');
  });

  it('routes the main ingredient cards to the ingredient selection flow', () => {
    expect(getIngredientSelectionRoute()).toBe('/recipe/ingredients');
  });

  it('uses the final recipe rail labels instead of temporary sections', () => {
    expect(getRecipeSections('main').map((section) => section.title)).toEqual([
      '후기 많은 인기 레시피',
      '스크랩 수가 말해주는 레시피',
      '가장 많이 공유된 레시피',
      '끝까지 만들기 좋은 레시피',
      '오늘의 랜덤 레시피',
    ]);
  });

  it('provides the Figma subtitles for every recipe rail', () => {
    expect(getRecipeSections('main').map((section) => section.description)).toEqual([
      '직접 만들어본 분들의 후기로 검증된 레시피예요.',
      '저장해두고 계속 찾게 되는 레시피예요.',
      '주변에 알리고 싶은 공유 랭킹 레시피를 모았어요.',
      '실제로 레시피를 완성한 후보들로 추려봤어요.',
      '팬트리 메이트가 오늘을 위해 골라봤어요.',
    ]);
  });

  it('shows up to three registered, available imminent pantry ingredients in expiry order', () => {
    expect(getImminentIngredients(pantryItems)).toEqual([{ name: '바나나', daysLeft: 2 }]);
  });

  it('prioritizes recipes using the three closest-expiring available pantry ingredients', () => {
    expect(getPantryRecipeRecommendations(pantryItems).map((recipe) => recipe.id)).toEqual([
      'kimchi-stew',
      'egg-potato-soup',
      'pork-vegetable-stir-fry',
    ]);
  });

  it('keeps the imminent route focused on recipes that use an imminent ingredient', () => {
    expect(getRecipeSections('imminent')[0].recipes).toEqual(
      recipeMocks.filter((recipe) =>
        recipe.ingredients.some((ingredient) => ingredient.isImminent),
      ),
    );
  });
});
