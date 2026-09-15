import { isEligibleForPantryReminder } from '@/features/pantry-reminder/model/daily-pantry-reminder';

type GetProfile = () => Promise<{ onboardingCompleted: boolean }>;
type RestoreSession = () => Promise<'complete' | 'onboarding'>;

/** 메모리 토큰을 먼저 사용하고, 만료된 경우 refresh 쿠키로 세션을 복구합니다. */
export async function resolvePantryReminderEligibility(
  getProfile: GetProfile,
  restoreSession: RestoreSession,
) {
  try {
    return isEligibleForPantryReminder(await getProfile());
  } catch {
    try {
      return (await restoreSession()) === 'complete';
    } catch {
      return false;
    }
  }
}
