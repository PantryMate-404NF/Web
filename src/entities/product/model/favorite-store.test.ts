import { describe, expect, it } from 'vitest';

import { toggleFavoriteProductId } from './favorite-store';

describe('favorite product model', () => {
  it('찜하지 않은 상품 ID를 추가한다', () => {
    expect(toggleFavoriteProductId([], 'free-range-eggs')).toEqual(['free-range-eggs']);
  });

  it('이미 찜한 상품 ID를 다시 선택하면 제거한다', () => {
    expect(
      toggleFavoriteProductId(['organic-broccoli', 'free-range-eggs'], 'free-range-eggs'),
    ).toEqual(['organic-broccoli']);
  });
});
