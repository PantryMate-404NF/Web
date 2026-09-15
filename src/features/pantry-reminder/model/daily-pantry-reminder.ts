export const PANTRY_REMINDER_HOUR = 19;
export const PANTRY_REMINDER_STORAGE_KEY = 'pantry-reminder:last-shown-date';

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function shouldShowDailyPantryReminder(now: Date, lastShownDateKey: string | null) {
  return now.getHours() >= PANTRY_REMINDER_HOUR && lastShownDateKey !== getLocalDateKey(now);
}

export function getMillisecondsUntilNextReminder(now: Date) {
  const nextReminder = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    PANTRY_REMINDER_HOUR,
  );

  if (nextReminder.getTime() <= now.getTime()) {
    nextReminder.setDate(nextReminder.getDate() + 1);
  }

  return nextReminder.getTime() - now.getTime();
}

export function isEligibleForPantryReminder(profile: { onboardingCompleted: boolean } | null) {
  return profile?.onboardingCompleted === true;
}

export function isPantryReminderPreviewEnabled(environment: string, requested: boolean) {
  return environment === 'development' && requested;
}

export function resolveReminderShownDate(storedDate: string | null, inMemoryDate: string | null) {
  if (!storedDate) return inMemoryDate;
  if (!inMemoryDate) return storedDate;

  return storedDate > inMemoryDate ? storedDate : inMemoryDate;
}
