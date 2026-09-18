import Image from 'next/image';

export function SplashScreen() {
  return (
    <main className="mobile-page flex min-h-dvh items-center justify-center [background:var(--primitive-primary-200)]">
      <Image alt="PantryMate" height={196} priority src="/images/logo/splash.svg" width={196} />
    </main>
  );
}
