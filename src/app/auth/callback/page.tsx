/**
 * /auth/callback 라우트의 엔트리입니다.
 * OAuth 세션 복구 기능은 features/auth에 두고, 이 파일은 Suspense 경계만 제공합니다.
 */
import { Suspense } from 'react';

import { AuthCallbackContent } from '@/features/auth/ui/auth-callback-content';

/** OAuth 콜백 기능 컴포넌트를 Suspense 경계 안에서 렌더링합니다. */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main>로그인 정보를 확인하고 있어요.</main>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
