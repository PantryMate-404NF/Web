import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CartCountBadge } from './cart-count-badge';

describe('CartCountBadge', () => {
  it('아이콘 버튼의 오른쪽 모서리에 수량 배지를 겹쳐 표시한다', () => {
    const markup = renderToStaticMarkup(<CartCountBadge count={9} />);

    expect(markup).toContain('right-0');
    expect(markup).not.toContain('-right-1');
    expect(markup).toContain('>9</span>');
  });
});
