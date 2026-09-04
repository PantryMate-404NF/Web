/**
 * OAuth 콜백 결과를 확인하고 Refresh Token 쿠키로 세션을 복구하는 기능 컴포넌트입니다.
 * 성공하면 팬트리로 이동하고, 실패하면 로그인 실패 상태로 이동합니다.
 */
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { reissueAccessToken } from '@/features/auth/api/reissue-access-token';

/** OAuth 콜백 결과에 따라 세션을 복구하고 다음 화면으로 이동합니다. */
export function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function restoreSession() {
      if (searchParams.get('result') !== 'success') {
        router.replace('/?login=failed');
        return;
      }

      try {
        await reissueAccessToken();
        router.replace('/pantry');
      } catch {
        router.replace('/?login=failed');
      }
    }

    void restoreSession();
  }, [router, searchParams]);

  return <main>로그인 정보를 확인하고 있어요.</main>;
}
