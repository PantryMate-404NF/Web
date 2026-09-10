'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { restoreAuthSession } from '@/features/auth/model/restore-auth-session';
import { Skeleton } from '@/shared/ui/skeleton';

/** OAuth 세션을 복구하는 짧은 시간 동안 표시하는 접근 가능한 로딩 화면입니다. */
export function AuthCallbackLoading() {
  return (
    <main
      aria-label="로그인 정보를 불러오는 중"
      className="mobile-page bg-background flex min-h-dvh flex-col items-center justify-center gap-3"
      role="status"
    >
      <Skeleton animated className="h-10 w-32 rounded-md" />
      <Skeleton animated className="h-4 w-24 rounded-full" />
    </main>
  );
}

/**
 * 백엔드 OAuth callback 결과를 확인하고 세션을 복구.
 * 완료 사용자는 완료 홈, 미완료 사용자는 온보딩 화면으로 보냄.
 */
export function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function restoreSession() {
      if (searchParams?.get('result') !== 'success') {
        router.replace('/?login=failed');
        return;
      }

      try {
        const homeState = await restoreAuthSession();
        router.replace(homeState === 'complete' ? '/?state=complete' : '/onboarding');
      } catch {
        router.replace('/?login=failed');
      }
    }

    void restoreSession();
  }, [router, searchParams]);

  return <AuthCallbackLoading />;
}
