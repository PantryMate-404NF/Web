import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearAccessToken,
  getAccessToken,
  getAuthenticatedUserId,
  setAccessToken,
  setAuthenticatedUserId,
} from '@/shared/model/access-token-store';

import { deleteMyAccount } from './delete-my-account';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/http-client', () => ({
  request: requestMock,
}));

describe('deleteMyAccount', () => {
  afterEach(() => {
    vi.clearAllMocks();
    clearAccessToken();
  });

  it('회원 탈퇴 API가 성공하면 메모리 인증 정보를 제거한다', async () => {
    setAccessToken('access-token');
    setAuthenticatedUserId('user-42');
    requestMock.mockResolvedValue(undefined);

    await deleteMyAccount();

    expect(requestMock).toHaveBeenCalledWith('/api/users/me', {
      method: 'DELETE',
      responseType: 'none',
    });
    expect(getAccessToken()).toBeNull();
    expect(getAuthenticatedUserId()).toBeNull();
  });

  it('회원 탈퇴 API가 실패하면 현재 인증 정보를 유지한다', async () => {
    setAccessToken('access-token');
    setAuthenticatedUserId('user-42');
    requestMock.mockRejectedValue(new Error('network'));

    await expect(deleteMyAccount()).rejects.toThrow('network');

    expect(getAccessToken()).toBe('access-token');
    expect(getAuthenticatedUserId()).toBe('user-42');
  });
});
