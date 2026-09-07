/**
 * 개발 환경에서만 MSW Service Worker가 준비된 뒤 하위 화면을 렌더링합니다.
 * 실제 백엔드 연동 환경에서는 NEXT_PUBLIC_API_MOCKING을 설정하지 않아 요청을 가로채지 않습니다.
 */
'use client';

import { useEffect, useState, type ReactNode } from 'react';

const isMockingEnabled =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_API_MOCKING === 'enabled';

export function MockProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(!isMockingEnabled);

  useEffect(() => {
    if (!isMockingEnabled) return;

    void import('./browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => setIsReady(true)),
    );
  }, []);

  if (!isReady) return null;

  return children;
}
