import { MoreHorizontal } from 'lucide-react';

import type { ExpirationStatus, PantryItem } from '@/entities/pantry/model/types';

const expirationStatusLabels: Record<ExpirationStatus, string> = {
  NORMAL: '소비기한 정상',
  IMMINENT: '소비기한 임박',
  EXPIRED: '소비기한 경과',
  UNREGISTERED: '소비기한 미등록',
};

const expirationStatusStyles: Record<ExpirationStatus, string> = {
  NORMAL: 'bg-muted text-muted-foreground',
  IMMINENT: 'bg-amber-100 text-amber-800',
  EXPIRED: 'bg-rose-100 text-rose-800',
  UNREGISTERED: 'bg-muted text-muted-foreground',
};

export function getExpirationStatusLabel(status: ExpirationStatus) {
  return expirationStatusLabels[status];
}

interface PantryItemCardProps {
  item: PantryItem;
}

export function PantryItemCard({ item }: PantryItemCardProps) {
  const availabilityLabel = item.availability === 'AVAILABLE' ? '요리 가능' : '확인 필요';

  return (
    <article className="bg-card flex min-w-0 flex-col rounded-2xl border p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div
          aria-label={item.imageAlt}
          className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg text-xs"
          role="img"
        >
          식재료
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-medium ${expirationStatusStyles[item.expirationStatus]}`}
        >
          {getExpirationStatusLabel(item.expirationStatus)}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{item.name}</h2>
          <p className="text-muted-foreground mt-1 truncate text-xs">{item.expirationLabel}</p>
        </div>
        <button
          aria-label={`${item.name} 옵션`}
          className="hover:bg-muted focus-visible:ring-ring flex size-11 shrink-0 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
          type="button"
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </button>
      </div>

      <p className="text-muted-foreground mt-3 text-xs">{availabilityLabel}</p>
    </article>
  );
}
