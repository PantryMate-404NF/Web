import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PantryToolbarProps {
  itemCount: number;
}

export function PantryToolbar({ itemCount }: PantryToolbarProps) {
  return (
    <section
      aria-label="팬트리 목록 도구"
      className="flex items-center justify-between px-4 pt-4 pb-4"
    >
      <p className="rounded-full bg-[#c5c6c9] px-3 py-1 text-xs font-medium text-[#131313]">
        {itemCount}개
      </p>
      <Button
        className="h-[25px] rounded-full bg-[#c5c6c9] px-3 text-xs text-[#131313] hover:bg-[#949497]"
        type="button"
        variant="ghost"
      >
        <SlidersHorizontal aria-hidden="true" className="size-3" />
        필터
      </Button>
    </section>
  );
}
