import { describe, expect, it } from 'vitest';

import { getMyPageAccessRoute } from './my-page-access';

describe('getMyPageAccessRoute', () => {
  it('비회원의 직접 마이페이지 접근은 로그인 화면으로 보낸다', () => {
    expect(getMyPageAccessRoute('guest')).toBe('/login');
  });

  it('로그인 사용자는 마이페이지에 머문다', () => {
    expect(getMyPageAccessRoute('complete')).toBeNull();
  });
});
