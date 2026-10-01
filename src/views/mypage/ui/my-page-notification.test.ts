import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { useAuthSessionMock } = vi.hoisted(() => ({
  useAuthSessionMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock('@/features/auth/ui/auth-session-provider', () => ({
  useAuthSession: useAuthSessionMock,
}));

vi.mock('@/entities/user/api/get-my-profile', () => ({
  getMyProfile: vi.fn(),
}));

vi.mock('@/features/auth/api/logout', () => ({
  logout: vi.fn(),
}));

vi.mock('@/widgets/navigation/ui/bottom-navigation', () => ({
  BottomNavigation: () => null,
}));

import { MyPagePage } from './my-page-page';

describe('Mypage notification action', () => {
  beforeEach(() => {
    useAuthSessionMock.mockReturnValue({
      state: 'complete',
      setGuestState: vi.fn(),
    });
  });

  it('provides a user-initiated action for enabling pantry notifications', () => {
    const markup = renderToStaticMarkup(createElement(MyPagePage));

    expect(markup).toContain('알림 지원 확인 중');
    expect(markup).toContain('type="button"');
    expect(markup).toContain('disabled=""');
  });

  it('uses the matching activity SVGs and the referenced eight-pixel icon inset', () => {
    const markup = renderToStaticMarkup(createElement(MyPagePage));

    expect(markup).toContain('orders.svg');
    expect(markup).toContain('heart.svg');
    expect(markup).toContain('scrap.svg');
    expect(markup).toContain('size-11 place-items-center p-2');
    expect(markup).toContain('px-4 py-3');
  });
});
