import { describe, expect, it } from 'vitest';

import { getMyPageDisplayName } from './my-page-profile';

describe('getMyPageDisplayName', () => {
  it('로그인 사용자 프로필의 닉네임을 표시한다', () => {
    expect(getMyPageDisplayName('팬트리메이트')).toBe('팬트리메이트');
  });

  it('프로필을 불러오는 동안에는 빈 이름을 반환한다', () => {
    expect(getMyPageDisplayName(null)).toBe('');
  });
});
