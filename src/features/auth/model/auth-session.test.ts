import { describe, expect, it } from 'vitest';

import { getPostAuthenticationRoute, getStateFreeHref } from './auth-session';

describe('getPostAuthenticationRoute', () => {
  it('온보딩 완료 사용자는 상태 쿼리 없이 홈 루트로 이동한다', () => {
    expect(getPostAuthenticationRoute('complete')).toBe('/');
  });

  it('온보딩 미완료 사용자는 온보딩으로 이동한다', () => {
    expect(getPostAuthenticationRoute('onboarding')).toBe('/onboarding');
  });
});

describe('getStateFreeHref', () => {
  it('로그인 완료 상태 쿼리만 제거하고 나머지 화면 쿼리는 유지한다', () => {
    expect(getStateFreeHref('/recipe', new URLSearchParams('state=complete&tab=imminent'))).toBe(
      '/recipe?tab=imminent',
    );
  });

  it('팬트리 화면의 실제 상태 쿼리는 유지한다', () => {
    expect(getStateFreeHref('/pantry', new URLSearchParams('state=edit&id=pantry-1'))).toBe(
      '/pantry?state=edit&id=pantry-1',
    );
  });
});
