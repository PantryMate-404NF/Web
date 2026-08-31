import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface MobileScreenProps {
  title: string;
  children: ReactNode;
  backHref?: string;
  action?: ReactNode;
}

export function MobileScreen({ title, children, backHref = '/', action }: MobileScreenProps) {
  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-[430px] px-4 pt-4 pb-10">
      <header className="flex h-12 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild aria-label="이전 페이지" size="icon" variant="ghost">
            <Link href={backHref}>
              <ChevronLeft aria-hidden="true" className="size-5" />
            </Link>
          </Button>
          <h1 className="text-title-2 truncate font-semibold tracking-tight">{title}</h1>
        </div>
        {action}
      </header>
      {children}
    </main>
  );
}
