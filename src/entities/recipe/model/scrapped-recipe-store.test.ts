import { describe, expect, it } from 'vitest';

import { toggleScrappedRecipeId } from './scrapped-recipe-store';

describe('scrapped recipe model', () => {
  it('스크랩하지 않은 레시피 ID를 추가한다', () => {
    expect(toggleScrappedRecipeId([], 'kimchi-stew')).toEqual(['kimchi-stew']);
  });

  it('이미 스크랩한 레시피 ID를 다시 선택하면 제거한다', () => {
    expect(toggleScrappedRecipeId(['kimchi-stew', 'egg-potato-soup'], 'kimchi-stew')).toEqual([
      'egg-potato-soup',
    ]);
  });
});
