import { describe, expect, it } from 'vitest';

import {
  getLocalDateKey,
  getMillisecondsUntilNextReminder,
  isEligibleForPantryReminder,
  isPantryReminderPreviewEnabled,
  resolveReminderShownDate,
  shouldShowDailyPantryReminder,
} from './daily-pantry-reminder';

describe('shouldShowDailyPantryReminder', () => {
  it('로컬 시간 19시 이전에는 표시하지 않는다', () => {
    const now = new Date(2026, 8, 14, 18, 59);

    expect(shouldShowDailyPantryReminder(now, null)).toBe(false);
  });

  it('19시 이후 오늘 표시한 기록이 없으면 표시한다', () => {
    const now = new Date(2026, 8, 14, 19, 0);

    expect(shouldShowDailyPantryReminder(now, null)).toBe(true);
  });

  it('오늘 이미 표시했다면 다시 표시하지 않는다', () => {
    const now = new Date(2026, 8, 14, 22, 30);

    expect(shouldShowDailyPantryReminder(now, '2026-09-14')).toBe(false);
  });

  it('다음 날 19시 이후에는 다시 표시한다', () => {
    const now = new Date(2026, 8, 15, 19, 0);

    expect(shouldShowDailyPantryReminder(now, '2026-09-14')).toBe(true);
  });
});

describe('getLocalDateKey', () => {
  it('실행 환경의 로컬 날짜를 YYYY-MM-DD로 만든다', () => {
    expect(getLocalDateKey(new Date(2026, 8, 4, 19))).toBe('2026-09-04');
  });
});

describe('getMillisecondsUntilNextReminder', () => {
  it('19시 전에는 오늘 19시까지 남은 시간을 반환한다', () => {
    expect(getMillisecondsUntilNextReminder(new Date(2026, 8, 14, 18, 30))).toBe(30 * 60 * 1000);
  });

  it('19시 이후에는 다음 날 19시까지 남은 시간을 반환한다', () => {
    expect(getMillisecondsUntilNextReminder(new Date(2026, 8, 14, 20, 0))).toBe(
      23 * 60 * 60 * 1000,
    );
  });
});

describe('isEligibleForPantryReminder', () => {
  it('인증된 사용자의 온보딩이 완료된 경우에만 허용한다', () => {
    expect(isEligibleForPantryReminder({ onboardingCompleted: true })).toBe(true);
    expect(isEligibleForPantryReminder({ onboardingCompleted: false })).toBe(false);
    expect(isEligibleForPantryReminder(null)).toBe(false);
  });
});

describe('isPantryReminderPreviewEnabled', () => {
  it('개발 환경에서 요청한 경우에만 미리보기를 허용한다', () => {
    expect(isPantryReminderPreviewEnabled('development', true)).toBe(true);
    expect(isPantryReminderPreviewEnabled('production', true)).toBe(false);
    expect(isPantryReminderPreviewEnabled('development', false)).toBe(false);
  });
});

describe('resolveReminderShownDate', () => {
  it('저장소 값이 없으면 현재 탭의 메모리 기록을 사용한다', () => {
    expect(resolveReminderShownDate(null, '2026-09-14')).toBe('2026-09-14');
    expect(resolveReminderShownDate('2026-09-15', '2026-09-14')).toBe('2026-09-15');
  });

  it('저장소 쓰기 실패 후에는 더 최신인 메모리 기록을 사용한다', () => {
    expect(resolveReminderShownDate('2026-09-14', '2026-09-15')).toBe('2026-09-15');
  });
});
