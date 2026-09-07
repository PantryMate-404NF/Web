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
  const [hasInitializationError, setHasInitializationError] = useState(false);

  useEffect(() => {
    if (!isMockingEnabled) return;

    async function initializeMockWorker() {
      try {
        const { worker } = await import('./browser');
        await worker.start({ onUnhandledRequest: 'bypass' });
        setIsReady(true);
      } catch {
        setHasInitializationError(true);
      }
    }

    void initializeMockWorker();
  }, []);

  if (hasInitializationError) {
    return (
      <main
        className="bg-background text-foreground grid min-h-dvh place-items-center p-6 text-center"
        role="alert"
      >
        개발용 API 목업을 시작하지 못했습니다. 새로고침하거나 MSW 설정을 확인해 주세요.
      </main>
    );
  }

  if (!isReady) return null;

  return children;
}
