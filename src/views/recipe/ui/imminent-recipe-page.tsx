import Link from 'next/link';

import { BottomNavigation } from '@/widgets/navigation/ui/bottom-navigation';

export function ImminentRecipePage() {
  return (
    <main className="mobile-page bg-background text-foreground flex min-h-dvh flex-col">
      <header className="flex h-16 items-center px-4">
        <Link className="text-sm" href="/recipe">
          레시피로 돌아가기
        </Link>
      </header>
      <section className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-[var(--primitive-grey-500)]">
          선택한 재료를 활용한 레시피 조회는 아직 지원되지 않아요.
        </p>
      </section>
      <BottomNavigation />
    </main>
  );
}
