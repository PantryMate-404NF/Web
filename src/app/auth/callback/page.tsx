/**
 * 카카오·네이버 소셜 로그인 완료 후 진입하는 페이지.
 * Refresh Token 쿠키로 Access Token을 복구한 뒤 팬트리 화면으로 이동합니다.
 */
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { reissueAccessToken } from '@/features/auth/api/reissue-access-token';

function AuthCallbackContent() {
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main>로그인 정보를 확인하고 있어요.</main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
