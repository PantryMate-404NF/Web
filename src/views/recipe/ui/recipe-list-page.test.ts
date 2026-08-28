import { describe, expect, it } from 'vitest';

import { getImminentRecipeSections } from './recipe-list-page';

describe('getImminentRecipeSections', () => {
  it('places the expiration-imminent recommendation before popular and recent recipes', () => {
    expect(getImminentRecipeSections().map((section) => section.title)).toEqual([
      '기한 임박! 이 레시피는 어떠세요',
      '이 달의 인기 레시피(임시)',
      '최근 본 레시피(임시)',
    ]);
  });
});
