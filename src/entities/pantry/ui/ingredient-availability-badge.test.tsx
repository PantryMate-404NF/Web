import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { IngredientAvailabilityBadge } from './ingredient-availability-badge';

describe('IngredientAvailabilityBadge', () => {
  it.each([
    ['all-owned', '전체 보유'],
    ['partially-owned', '일부 보유'],
    ['imminent', '기한 임박'],
    ['none', '식재료 없음'],
  ] as const)('%s 상태를 식재료 보유 현황으로 표시한다', (status, label) => {
    const markup = renderToStaticMarkup(<IngredientAvailabilityBadge status={status} />);

    expect(markup).toContain(label);
  });
});
