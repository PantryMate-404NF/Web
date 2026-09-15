import { describe, expect, it, vi } from 'vitest';

import { resolvePantryReminderEligibility } from './resolve-pantry-reminder-eligibility';

describe('resolvePantryReminderEligibility', () => {
  it('현재 프로필 조회가 성공하면 온보딩 완료 상태를 사용한다', async () => {
    const restoreSession = vi.fn();

    await expect(
      resolvePantryReminderEligibility(async () => ({ onboardingCompleted: true }), restoreSession),
    ).resolves.toBe(true);
    expect(restoreSession).not.toHaveBeenCalled();
  });

  it('메모리 토큰이 없으면 refresh 쿠키로 세션을 복구한다', async () => {
    await expect(
      resolvePantryReminderEligibility(
        async () => Promise.reject(new Error('Unauthorized')),
        async () => 'complete',
      ),
    ).resolves.toBe(true);
  });

  it('프로필 조회와 세션 복구가 모두 실패하면 표시하지 않는다', async () => {
    await expect(
      resolvePantryReminderEligibility(
        async () => Promise.reject(new Error('Unauthorized')),
        async () => Promise.reject(new Error('Unauthorized')),
      ),
    ).resolves.toBe(false);
  });
});
