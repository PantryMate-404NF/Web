import { describe, expect, it } from 'vitest';

import { getIngredientSelectionRoute, getRecipeRoute, getRecipeSections } from './recipe-list-page';

describe('getRecipeSections', () => {
  it('keeps the expiration-imminent mock on its own route', () => {
    expect(getRecipeRoute('imminent')).toBe('/recipe/imminent');
  });

  it('routes the main ingredient cards to the ingredient selection flow', () => {
    expect(getIngredientSelectionRoute()).toBe('/recipe/ingredients');
  });

  it('places main ingredients before popular and recent recipes on the main tab', () => {
    expect(getRecipeSections('main').map((section) => section.title)).toEqual([
      '주재료 레시피(임시)',
      '이 달의 인기 레시피(임시)',
      '최근 본 레시피(임시)',
    ]);
  });

  it('places the expiration-imminent recommendation before popular and recent recipes', () => {
    expect(getRecipeSections('imminent').map((section) => section.title)).toEqual([
      '기한 임박! 이 레시피는 어떠세요',
      '이 달의 인기 레시피(임시)',
      '최근 본 레시피(임시)',
    ]);
  });
});
