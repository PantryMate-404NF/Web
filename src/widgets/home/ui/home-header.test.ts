import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { useAuthSessionMock, useCartQueryMock } = vi.hoisted(() => ({
  useAuthSessionMock: vi.fn(),
  useCartQueryMock: vi.fn(),
}));

vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('@/entities/cart/api/use-cart-query', () => ({ useCartQuery: useCartQueryMock }));
vi.mock('@/shared/config/cart-write-mode', () => ({
  CART_HREF: '/cart',
  CART_WRITE_MODE: 'api',
}));

import { HomeHeader } from './home-header';

describe('HomeHeader', () => {
  beforeEach(() => {
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useCartQueryMock.mockReturnValue({ data: { items: [] } });
  });

  it('브랜드 로고를 실제 크기로 표시하고 홈으로 이동시킨다', () => {
    const markup = renderToStaticMarkup(createElement(HomeHeader));

    expect(markup).toContain('href="/"');
    expect(markup).toContain('w-[151px]');
    expect(markup).toContain('width="150"');
    expect(markup).toContain('height="64"');
  });

  it('장바구니 수량을 아이콘 우측 상단에 표시한다', () => {
    useCartQueryMock.mockReturnValue({
      data: { items: [{ quantity: 4 }, { quantity: 5 }] },
    });
    const markup = renderToStaticMarkup(createElement(HomeHeader));

    expect(useCartQueryMock).toHaveBeenCalledWith(true);
    expect(markup).toContain('aria-label="장바구니 9개 상품"');
    expect(markup).toContain('>9</span>');
    expect(markup).toContain('href="/cart"');
    expect(markup).toContain('shopping-cart-icon.svg');
  });
});
