import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

import { PromotionPage } from './promotion-page';

describe('PromotionPage', () => {
  it('피그마 크기의 프로모션 배너 네 개를 렌더링한다', () => {
    const markup = renderToStaticMarkup(createElement(PromotionPage));

    expect(markup).toContain('프로모션');
    expect(markup).toContain('우리 가족 안심 선택');
    expect(markup).toContain('w-[358px]');
    expect(markup.match(/data-promotion-banner=/g)).toHaveLength(4);
  });
});
