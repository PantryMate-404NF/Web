import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PantryToolbarProps {
  itemCount: number;
}

export function PantryToolbar({ itemCount }: PantryToolbarProps) {
  return (
    <section aria-label="팬트리 목록 도구" className="flex items-center justify-between py-4">
      <p className="text-sm font-medium">보유 식재료 {itemCount}개</p>
      <Button className="h-10" type="button" variant="outline">
        <SlidersHorizontal aria-hidden="true" className="size-4" />
        필터
      </Button>
    </section>
  );
}
