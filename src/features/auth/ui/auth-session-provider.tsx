'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import type { AuthHomeState } from '../model/restore-auth-session';
import { restoreAuthSession } from '../model/restore-auth-session';
import type { AuthSessionState } from '../model/auth-session';

interface AuthSessionContextValue {
  state: AuthSessionState;
  restore: () => Promise<Exclude<AuthSessionState, 'loading'>>;
  setAuthenticatedState: (state: AuthHomeState) => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

/** refresh 쿠키를 기준으로 앱 전환 중에도 유지되는 로그인·온보딩 상태를 제공합니다. */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthSessionState>('loading');

  const restore = useCallback(async (): Promise<Exclude<AuthSessionState, 'loading'>> => {
    try {
      const restoredState = await restoreAuthSession();
      setState(restoredState);
      return restoredState;
    } catch {
      setState('guest');
      return 'guest' as const;
    }
  }, []);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      void restore();
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, [restore]);

  const value = useMemo(
    () => ({
      state,
      restore,
      setAuthenticatedState: setState,
    }),
    [restore, state],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    return {
      state: 'loading' as const,
      restore: async () => 'guest' as const,
      setAuthenticatedState: () => undefined,
    };
  }

  return context;
}
