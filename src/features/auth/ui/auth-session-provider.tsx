'use client';

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { AuthHomeState } from '../model/restore-auth-session';
import { restoreAuthSession } from '../model/restore-auth-session';
import {
  getApplicableRestoreState,
  getStateFreeHref,
  type AuthSessionState,
} from '../model/auth-session';

interface AuthSessionContextValue {
  state: AuthSessionState;
  restore: () => Promise<Exclude<AuthSessionState, 'loading'>>;
  setAuthenticatedState: (state: AuthHomeState) => void;
  setGuestState: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

function AuthStateQueryCleaner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const href = getStateFreeHref(pathname, new URLSearchParams(query));
    const currentHref = query ? `${pathname}?${query}` : pathname;

    if (href !== currentHref) {
      router.replace(href, { scroll: false });
    }
  }, [pathname, query, router]);

  return null;
}

/** refresh 쿠키를 기준으로 앱 전환 중에도 유지되는 로그인·온보딩 상태를 제공합니다. */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthSessionState>('loading');
  const sessionRevisionRef = useRef(0);

  const restore = useCallback(async (): Promise<Exclude<AuthSessionState, 'loading'>> => {
    const restoreRevision = sessionRevisionRef.current;

    try {
      const restoredState = await restoreAuthSession();
      const applicableState = getApplicableRestoreState(
        restoreRevision,
        sessionRevisionRef.current,
        restoredState,
      );

      if (applicableState) setState(applicableState);
      return restoredState;
    } catch {
      const applicableState = getApplicableRestoreState(
        restoreRevision,
        sessionRevisionRef.current,
        'guest',
      );

      if (applicableState) setState(applicableState);
      return 'guest' as const;
    }
  }, []);

  const setAuthenticatedState = useCallback((nextState: AuthHomeState) => {
    sessionRevisionRef.current += 1;
    setState(nextState);
  }, []);

  const setGuestState = useCallback(() => {
    sessionRevisionRef.current += 1;
    setState('guest');
  }, []);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      void restore();
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, [restore]);

  const value = useMemo(
    () => ({ state, restore, setAuthenticatedState, setGuestState }),
    [restore, setAuthenticatedState, setGuestState, state],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      <Suspense fallback={null}>
        <AuthStateQueryCleaner />
      </Suspense>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    return {
      state: 'loading' as const,
      restore: async () => 'guest' as const,
      setAuthenticatedState: () => undefined,
      setGuestState: () => undefined,
    };
  }

  return context;
}
