import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function PantryHeader() {
  return (
    <header className="flex h-12 items-center justify-between px-4 py-2">
      <div className="flex min-w-0 items-center gap-4">
        <Button asChild className="size-8 rounded-full" size="icon" variant="ghost">
          <Link aria-label="이전 페이지" href="/">
            <ChevronLeft aria-hidden="true" className="size-5" />
          </Link>
        </Button>
        <h1 className="text-foreground text-label-3 w-[104px] truncate rounded-full bg-[#949497] px-4 py-1.5 text-center font-semibold">
          나의 팬트리
        </h1>
      </div>
      <Button
        asChild
        className="text-foreground text-label-4 h-8 shrink-0 rounded-lg bg-[#eff0f4] px-3 hover:bg-[#c5c6c9]"
        variant="ghost"
      >
        <Link href="/pantry?state=edit">식재료 추가</Link>
      </Button>
    </header>
  );
}
