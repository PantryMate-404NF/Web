import type { PantryCardVariant, PantryItem } from '@/entities/pantry/model/types';
import { PantryItemCard } from '@/entities/pantry/ui/pantry-item-card';

interface PantryGridProps {
  items: PantryItem[];
  variant?: PantryCardVariant;
}

export function PantryGrid({ items, variant = 'icon' }: PantryGridProps) {
  return (
    <section
      aria-label="팬트리 식재료 목록"
      className={`grid grid-cols-2 px-4 pb-8 ${variant === 'image' ? 'gap-2' : 'gap-3'}`}
    >
      {items.map((item) => (
        <PantryItemCard item={item} key={item.id} variant={variant} />
      ))}
    </section>
  );
}
