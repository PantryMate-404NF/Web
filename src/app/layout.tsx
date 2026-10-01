import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Providers } from '@/app/providers';
import { RegisterServiceWorker } from '@/components/pwa/register-service-worker';

import './globals.css';

const SITE_NAME = 'PantryMate';
const SITE_DESCRIPTION =
  '우리 집 식재료로 오늘의 메뉴를 추천받고, 부족한 재료까지 간편하게 구매하세요.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.unzipp.cloud'),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: SITE_NAME },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
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
