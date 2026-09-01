import { Image as ImageIcon, MoreHorizontal, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type {
  ExpirationStatus,
  PantryCardVariant,
  PantryItem,
} from '@/entities/pantry/model/types';

const expirationStatusLabels: Record<ExpirationStatus, string> = {
  NORMAL: '정상',
  IMMINENT: '임박',
  EXPIRED: '경과',
  UNREGISTERED: '미등록',
};

const expirationStatusStyles: Record<ExpirationStatus, string> = {
  NORMAL: 'bg-muted text-foreground',
  IMMINENT: 'bg-muted text-foreground',
  EXPIRED: 'bg-muted text-foreground',
  UNREGISTERED: 'bg-muted text-foreground',
};

export function getExpirationStatusLabel(status: ExpirationStatus) {
  return expirationStatusLabels[status];
}

interface PantryItemCardProps {
  item: PantryItem;
  variant?: PantryCardVariant;
}

function ItemOptionsLink({ itemName }: { itemName: string }) {
  return (
    <Link
      aria-label={`${itemName} 옵션`}
      className="flex size-6 shrink-0 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:outline-none"
      href="/pantry?state=delete-confirm"
    >
      <MoreHorizontal aria-hidden="true" className="size-4" />
    </Link>
  );
}

function PantryImageCard({ item }: { item: PantryItem }) {
  return (
    <article className="text-foreground bg-muted flex h-[203px] min-w-0 flex-col rounded-2xl px-[5px] py-3">
      <div className="flex items-center justify-between">
        <span
          className={`text-label-4 rounded-full px-2 py-0.5 font-medium ${expirationStatusStyles[item.expirationStatus]}`}
        >
          {getExpirationStatusLabel(item.expirationStatus)}
        </span>
        <ItemOptionsLink itemName={item.name} />
      </div>

      <div className="relative mx-auto mt-1 flex size-[100px] items-center justify-center overflow-hidden rounded-lg bg-[#c5c6c9]">
        {item.imageUrl ? (
          <Image
            alt={item.imageAlt}
            className="object-cover"
            fill
            sizes="100px"
            src={item.imageUrl}
          />
        ) : (
          <ImageIcon aria-label={item.imageAlt} className="text-muted-foreground size-6" />
        )}
      </div>

      <div className="mt-2 px-1">
        <h2 className="text-body-4 truncate font-semibold">{item.name}</h2>
        <p className="text-label-4 text-muted-foreground mt-1 truncate">{item.expirationLabel}</p>
      </div>
    </article>
  );
}

function PantryIconCard({ item }: { item: PantryItem }) {
  const availabilityLabel = item.availability === 'AVAILABLE' ? '요리 가능' : '확인 필요';

  return (
    <article className="text-foreground bg-muted flex h-[104px] min-w-0 flex-col rounded-2xl px-2.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <div
          aria-label={item.imageAlt}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#c5c6c9]"
          role="img"
        >
          <Package aria-hidden="true" className="size-4" />
        </div>
        <span
          className={`text-label-4 rounded-full px-2 py-0.5 font-medium ${expirationStatusStyles[item.expirationStatus]}`}
        >
          {getExpirationStatusLabel(item.expirationStatus)}
        </span>
      </div>

      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-body-4 truncate font-semibold">{item.name}</h2>
          <p className="text-label-4 text-muted-foreground mt-1 truncate">{item.expirationLabel}</p>
        </div>
        <ItemOptionsLink itemName={item.name} />
      </div>

      <p className="sr-only">{availabilityLabel}</p>
    </article>
  );
}

export function PantryItemCard({ item, variant = 'icon' }: PantryItemCardProps) {
  if (variant === 'image') return <PantryImageCard item={item} />;

  return <PantryIconCard item={item} />;
}
