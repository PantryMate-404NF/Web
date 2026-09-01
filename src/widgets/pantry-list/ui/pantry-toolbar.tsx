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
      <p className="bg-muted text-foreground text-label-4 rounded-full px-3 py-1 font-medium">
        {itemCount}개
      </p>
      <Button
        className="bg-muted text-foreground hover:bg-accent text-label-4 h-[25px] rounded-full px-3"
        type="button"
        variant="ghost"
      >
        <SlidersHorizontal aria-hidden="true" className="size-3" />
        필터
      </Button>
    </section>
  );
}
