'use client';

import { useEffect, useState } from 'react';

import { getMyProfile } from '@/entities/user/api/get-my-profile';
import { restoreAuthSession } from '@/features/auth/model/restore-auth-session';
import { isPantryReminderPreviewEnabled } from '@/features/pantry-reminder/model/daily-pantry-reminder';
import { DailyPantryReminder } from '@/features/pantry-reminder/ui/daily-pantry-reminder';

import { resolvePantryReminderEligibility } from '../model/resolve-pantry-reminder-eligibility';

export function HomePantryReminder({ forceOpen = false }: { forceOpen?: boolean }) {
  const isPreviewEnabled = isPantryReminderPreviewEnabled(process.env.NODE_ENV, forceOpen);
  const [isEligible, setIsEligible] = useState(isPreviewEnabled);

  useEffect(() => {
    if (isPreviewEnabled) return;

    let isCancelled = false;

    void resolvePantryReminderEligibility(getMyProfile, restoreAuthSession).then((isAllowed) => {
      if (!isCancelled) setIsEligible(isAllowed);
    });

    return () => {
      isCancelled = true;
    };
  }, [isPreviewEnabled]);

  return <DailyPantryReminder forceOpen={forceOpen} isEligible={isEligible} />;
}
