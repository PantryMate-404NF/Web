import { describe, expect, it } from 'vitest';

import { getPostAuthenticationRoute } from './auth-session';

describe('getPostAuthenticationRoute', () => {
  it('온보딩 완료 사용자는 상태 쿼리 없이 홈 루트로 이동한다', () => {
    expect(getPostAuthenticationRoute('complete')).toBe('/');
  });

  it('온보딩 미완료 사용자는 온보딩으로 이동한다', () => {
    expect(getPostAuthenticationRoute('onboarding')).toBe('/onboarding');
  });
});
