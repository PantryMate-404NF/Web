'use client';

import { useEffect, useRef } from 'react';

import type { AuthSessionState } from '@/features/auth/model/auth-session';

/** 로그인 상태가 복구된 세션에서 허용된 FCM 토큰을 한 번 등록합니다. */
export function DeviceTokenRegistration({ state }: { state: AuthSessionState }) {
  const hasAttemptedRegistration = useRef(false);

  useEffect(() => {
    if (state === 'guest') {
      hasAttemptedRegistration.current = false;
      return;
    }

    if ((state !== 'complete' && state !== 'onboarding') || hasAttemptedRegistration.current) {
      return;
    }

    hasAttemptedRegistration.current = true;
    void import('../model/notification-registration')
      .then(({ registerTokenForSession }) => {
        return registerTokenForSession(state);
      })
      .catch(() => undefined);
  }, [state]);

  return null;
}
