'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { HomePage } from '@/views/home/ui/home-page';

import {
  APP_ENTRY_STORAGE_KEY,
  getAppEntryMode,
  getPostSplashRoute,
  SPLASH_DURATION_MS,
} from '../model/entry-flow';
import { SplashScreen } from './splash-screen';

export function AppEntryPage({ forceReminder = false }: { forceReminder?: boolean }) {
  const router = useRouter();
  const [entryMode, setEntryMode] = useState<'splash' | 'home'>('splash');

  useEffect(() => {
    const hasEnteredApp = window.sessionStorage.getItem(APP_ENTRY_STORAGE_KEY) === 'true';

    if (getAppEntryMode(hasEnteredApp) === 'home') {
      const homeTimer = window.setTimeout(() => setEntryMode('home'), 0);
      return () => window.clearTimeout(homeTimer);
    }

    const splashTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(APP_ENTRY_STORAGE_KEY, 'true');
      router.replace(getPostSplashRoute());
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(splashTimer);
  }, [router]);

  return entryMode === 'home' ? <HomePage forceReminder={forceReminder} /> : <SplashScreen />;
}
