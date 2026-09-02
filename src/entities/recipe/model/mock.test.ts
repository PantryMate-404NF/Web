import { describe, expect, it } from 'vitest';

import { getRecipeById } from './mock';

describe('getRecipeById', () => {
  it('returns products linked to the current recipe shortage ingredients', () => {
    expect(getRecipeById('kimchi-stew').linkedProducts).toEqual([
      {
        id: 'pork',
        ingredient: '돼지고기',
        name: '국내산 돼지고기 앞다리살',
        price: 7980,
        isShortage: true,
      },
      { id: 'tofu', ingredient: '두부', name: '국산 콩두부', price: 2480, isShortage: true },
    ]);
  });

  it('returns no linked products when the current recipe has no missing ingredients', () => {
    expect(getRecipeById('egg-potato-soup').linkedProducts).toEqual([]);
  });

  it('returns a single linked product when only one ingredient is missing', () => {
    expect(getRecipeById('pork-vegetable-stir-fry').linkedProducts).toEqual([
      {
        id: 'mushroom',
        ingredient: '버섯',
        name: '국내산 새송이버섯',
        price: 2980,
        isShortage: true,
      },
    ]);
  });

  it('provides ordered cooking steps for the recipe detail', () => {
    expect(getRecipeById('kimchi-stew').cookingSteps).toEqual([
      '냄비에 김치와 돼지고기를 넣고 볶아 주세요.',
      '물과 양념을 넣고 끓인 뒤 두부와 대파를 넣어 마무리해요.',
      '한소끔 더 끓인 뒤 간을 맞춰 주세요.',
      '그릇에 담아 따뜻할 때 맛있게 즐겨요.',
    ]);
  });
});
