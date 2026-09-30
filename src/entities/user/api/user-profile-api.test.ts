import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const profileResponse = {
  userId: '1024',
  provider: 'KAKAO',
  email: 'user@example.com',
  nickname: '수현',
  profileImageUrl: null,
  phoneNumber: '01012345678',
  birthDate: '1999-01-31',
  role: 'ROLE_USER',
  onboardingCompleted: true,
  createdAt: '2026-09-30T00:00:00Z',
  updatedAt: '2026-09-30T00:00:00Z',
};

function successResponse(data: unknown) {
  return new Response(
    JSON.stringify({
      status: 'SUCCESS',
      message: '성공',
      data,
      error: null,
      timestamp: '2026-09-30T00:00:00Z',
    }),
  );
}

describe('user profile API', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000');
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(successResponse(profileResponse)));
  });

  afterEach(() => vi.unstubAllGlobals());

  it('프로필 수정 명세에 맞춰 PATCH 요청을 보내고 수정된 프로필을 반환한다', async () => {
    const { updateMyProfile } = await import('./update-my-profile');
    const payload = {
      nickname: '수현',
      phoneNumber: '01012345678',
      birthDate: '1999-01-31',
    };

    const updatedProfile = await updateMyProfile(payload);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/me',
      expect.objectContaining({ body: JSON.stringify(payload), method: 'PATCH' }),
    );
    expect(updatedProfile).toEqual(profileResponse);
  });
});
