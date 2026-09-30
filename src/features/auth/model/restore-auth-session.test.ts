import { afterEach, describe, expect, it, vi } from 'vitest';

const { getMyProfileMock, reissueAccessTokenMock } = vi.hoisted(() => ({
  getMyProfileMock: vi.fn(),
  reissueAccessTokenMock: vi.fn(),
}));

vi.mock('@/entities/user/api/get-my-profile', () => ({ getMyProfile: getMyProfileMock }));
vi.mock('@/features/auth/api/reissue-access-token', () => ({
  reissueAccessToken: reissueAccessTokenMock,
}));

describe('restoreAuthSession', () => {
  afterEach(async () => {
    vi.resetAllMocks();
    const { clearAccessToken } = await import('@/shared/model/access-token-store');

    clearAccessToken();
  });

  it('프로필을 복구한 뒤 현재 사용자의 ID를 요청 컨텍스트에 저장한다', async () => {
    getMyProfileMock.mockResolvedValue({
      userId: 'user-42',
      provider: 'KAKAO',
      email: 'user@example.com',
      nickname: '팬트리메이트',
      profileImageUrl: null,
      role: 'ROLE_USER',
      onboardingCompleted: true,
      createdAt: '2026-09-29T00:00:00Z',
      updatedAt: '2026-09-29T00:00:00Z',
      birthDate: '1990-01-01',
      phoneNumber: '010-0000-0000',
    });
    const { getAuthenticatedUserId } = await import('@/shared/model/access-token-store');
    const { restoreAuthSession } = await import('./restore-auth-session');

    await expect(restoreAuthSession()).resolves.toBe('complete');

    expect(getAuthenticatedUserId()).toBe('user-42');
  });
});
