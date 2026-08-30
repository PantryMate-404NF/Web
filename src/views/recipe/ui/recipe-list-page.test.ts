import { describe, expect, it } from 'vitest';

import { getRecipeSections } from './recipe-list-page';

describe('getRecipeSections', () => {
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
