import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Providers } from '@/app/providers';
import { RegisterServiceWorker } from '@/components/pwa/register-service-worker';

import './globals.css';

export const metadata: Metadata = {
  title: 'AI Pantry',
  description: '구매 이력으로 시작하는 나만의 식재료 팬트리',
  applicationName: 'AI Pantry',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'AI Pantry' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#FFCD55',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
