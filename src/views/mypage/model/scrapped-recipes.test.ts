import { describe, expect, it } from 'vitest';

import { recipeMocks } from '@/entities/recipe/model/mock';

import { selectScrappedRecipes } from './scrapped-recipes';

describe('scrapped recipes', () => {
  it('저장된 레시피 ID 순서대로 스크랩 목록을 만든다', () => {
    expect(
      selectScrappedRecipes(['egg-potato-soup', 'kimchi-stew'], recipeMocks).map(
        (recipe) => recipe.id,
      ),
    ).toEqual(['egg-potato-soup', 'kimchi-stew']);
  });

  it('현재 레시피 데이터에 없는 ID는 목록에서 제외한다', () => {
    expect(
      selectScrappedRecipes(['kimchi-stew', 'removed-recipe'], recipeMocks).map(
        (recipe) => recipe.id,
      ),
    ).toEqual(['kimchi-stew']);
  });
});
