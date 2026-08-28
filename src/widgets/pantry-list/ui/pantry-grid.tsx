import type { PantryItem } from '@/entities/pantry/model/types';
import { PantryItemCard } from '@/entities/pantry/ui/pantry-item-card';

interface PantryGridProps {
  items: PantryItem[];
}

export function PantryGrid({ items }: PantryGridProps) {
  return (
    <section aria-label="팬트리 식재료 목록" className="grid grid-cols-2 gap-3 px-4 pb-8">
      {items.map((item) => (
        <PantryItemCard item={item} key={item.id} />
      ))}
    </section>
  );
}
