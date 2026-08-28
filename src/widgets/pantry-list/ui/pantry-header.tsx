import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function PantryHeader() {
  return (
    <header className="flex h-12 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button asChild className="size-11" size="icon" variant="ghost">
          <Link aria-label="이전 페이지" href="/">
            <ChevronLeft aria-hidden="true" className="size-6" />
          </Link>
        </Button>
        <h1 className="truncate text-xl font-semibold tracking-tight">나의 팬트리</h1>
      </div>
      <Button className="h-10 shrink-0 px-3" type="button">
        <Plus aria-hidden="true" className="size-4" />
        식재료 추가
      </Button>
    </header>
  );
}
