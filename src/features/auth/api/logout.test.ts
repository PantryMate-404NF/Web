import { afterEach, describe, expect, it, vi } from 'vitest';

import { setAccessToken, getAccessToken } from '@/shared/model/access-token-store';

import { logout } from './logout';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/http-client', () => ({
  request: requestMock,
}));

describe('logout', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('로그아웃 API가 성공하면 메모리 Access Token을 제거한다', async () => {
    setAccessToken('access-token');
    requestMock.mockResolvedValue(undefined);

    await logout();

    expect(requestMock).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      responseType: 'none',
    });
    expect(getAccessToken()).toBeNull();
  });
});
