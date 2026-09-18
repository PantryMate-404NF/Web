/**
 * Access Token 재발급 응답이 유효하지 않을 때
 * 빈 토큰을 메모리에 저장하지 않고 실패하는지 검증합니다.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { clearAccessToken, getAccessToken } from '@/shared/model/access-token-store';

import { reissueAccessToken } from './reissue-access-token';

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}));

vi.mock('@/shared/api/http-client', () => ({
  request: requestMock,
}));

describe('reissueAccessToken', () => {
  afterEach(() => {
    vi.clearAllMocks();
    clearAccessToken();
  });

  it('빈 Access Token 응답을 인증 성공으로 처리하지 않는다', async () => {
    requestMock.mockResolvedValue({ accessToken: '' });

    await expect(reissueAccessToken()).rejects.toThrow('유효한 Access Token이 없습니다.');

    expect(getAccessToken()).toBeNull();
  });
});
