import { MoreHorizontal, Package } from 'lucide-react';
import Link from 'next/link';

import type { ExpirationStatus, PantryItem } from '@/entities/pantry/model/types';

const expirationStatusLabels: Record<ExpirationStatus, string> = {
  NORMAL: '정상',
  IMMINENT: '임박',
  EXPIRED: '경과',
  UNREGISTERED: '미등록',
};

const expirationStatusStyles: Record<ExpirationStatus, string> = {
  NORMAL: 'bg-[#c5c6c9] text-[#131313]',
  IMMINENT: 'bg-[#c5c6c9] text-[#131313]',
  EXPIRED: 'bg-[#c5c6c9] text-[#131313]',
  UNREGISTERED: 'bg-[#c5c6c9] text-[#131313]',
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
    <article className="flex h-[104px] min-w-0 flex-col rounded-2xl bg-[#eff0f4] px-2.5 py-3 text-[#131313]">
      <div className="flex items-start justify-between gap-2">
        <div
          aria-label={item.imageAlt}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c5c6c9]"
          role="img"
        >
          <Package aria-hidden="true" className="size-4" />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${expirationStatusStyles[item.expirationStatus]}`}
        >
          {getExpirationStatusLabel(item.expirationStatus)}
        </span>
      </div>

      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold">{item.name}</h2>
          <p className="mt-1 truncate text-xs text-[#949497]">{item.expirationLabel}</p>
        </div>
        <Link
          aria-label={`${item.name} 옵션`}
          className="flex size-6 shrink-0 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
          href="/pantry?state=delete-confirm"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <p className="sr-only">{availabilityLabel}</p>
    </article>
  );
}
