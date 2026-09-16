import { Image as ImageIcon, Package } from 'lucide-react';
import Image from 'next/image';

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

export function getExpirationBadgeLabel(label: string, status: ExpirationStatus) {
  if (status === 'EXPIRED') return '경과';
  if (status === 'UNREGISTERED') return '미등록';
  const days = label.match(/(\d+)일/)?.[1];
  return days ? `D-${days}` : getExpirationStatusLabel(status);
}

interface PantryItemCardProps {
  item: PantryItem;
  variant?: PantryCardVariant;
  onOptions?: (trigger: HTMLButtonElement) => void;
}

function ItemOptionsLink({
  itemName,
  onOptions,
}: {
  itemName: string;
  onOptions?: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      aria-label={`${itemName} 옵션`}
      className="flex size-10 shrink-0 items-center justify-center rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none"
      onClick={(event) => onOptions?.(event.currentTarget)}
      type="button"
    >
      <Image alt="" aria-hidden="true" height={24} src="/images/pantry/dots.svg" width={24} />
    </button>
  );
}

function PantryImageCard({
  item,
  onOptions,
}: {
  item: PantryItem;
  onOptions?: (trigger: HTMLButtonElement) => void;
}) {
  const storageLabels = { REFRIGERATED: '냉장', FROZEN: '냉동', ROOMTEMP: '실온' } as const;
  const sourceLabels = {
    PURCHASED: '자사몰 구매',
    MANUAL: '사용자 등록',
    OCR: '영수증 등록',
  } as const;
  const sourceLabel = item.registrationSource
    ? sourceLabels[item.registrationSource]
    : '등록 출처 미확인';
  const storageIconSrc =
    item.storageType === 'FROZEN'
      ? '/images/pantry/snow.svg'
      : item.storageType === 'ROOMTEMP'
        ? '/images/pantry/sun.svg'
        : '/images/pantry/refrigerator.svg';

  return (
    <article className="text-foreground bg-card shadow-card relative flex h-[156px] min-w-0 flex-col rounded-xl p-3">
      <div className="flex items-start justify-between">
        <div className="bg-placeholder relative size-20 overflow-hidden rounded-sm">
          {item.imageUrl ? (
            <Image
              alt={item.imageAlt}
              className="object-cover"
              fill
              sizes="80px"
              src={item.imageUrl}
            />
          ) : (
            <ImageIcon
              aria-label={item.imageAlt}
              className="text-muted-foreground absolute inset-0 m-auto size-6"
            />
          )}
        </div>
        <span
          className={`flex h-5 items-center rounded-full px-2 text-xs leading-[18px] font-semibold ${item.expirationStatus === 'EXPIRED' ? 'bg-destructive/10 text-destructive' : item.expirationStatus === 'IMMINENT' ? 'bg-primary/20 text-status-warning' : 'bg-muted text-muted-foreground'}`}
        >
          {getExpirationBadgeLabel(item.expirationLabel, item.expirationStatus)}
        </span>
      </div>
      <div className="mt-1.5 min-w-0">
        <h2 className="truncate text-[15px] leading-[22.5px] font-semibold">{item.name}</h2>
        <p className="text-muted-foreground mt-1 flex items-center gap-0.5 truncate text-xs leading-[18px] font-medium">
          <span className="flex items-center gap-1.5">
            <Image
              alt=""
              aria-hidden="true"
              className="size-[13px] shrink-0 object-contain"
              height={13}
              src={storageIconSrc}
              width={13}
            />
            <span>{item.storageType ? storageLabels[item.storageType] : '냉장'}</span>
          </span>
          <span className="text-disabled">·</span>
          <span>{sourceLabel}</span>
        </p>
      </div>
      <div className="absolute right-[-6px] bottom-[5px]">
        <ItemOptionsLink itemName={item.name} onOptions={onOptions} />
      </div>
    </article>
  );
}

function PantryIconCard({
  item,
  onOptions,
}: {
  item: PantryItem;
  onOptions?: (trigger: HTMLButtonElement) => void;
}) {
  const availabilityLabel = item.availability === 'AVAILABLE' ? '요리 가능' : '확인 필요';

  return (
    <article className="text-foreground bg-muted flex h-[104px] min-w-0 flex-col rounded-2xl px-2.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <div
          aria-label={item.imageAlt}
          className="bg-placeholder flex size-10 shrink-0 items-center justify-center rounded-lg"
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
        <ItemOptionsLink itemName={item.name} onOptions={onOptions} />
      </div>

      <p className="sr-only">{availabilityLabel}</p>
    </article>
  );
}

export function PantryItemCard({ item, variant = 'icon', onOptions }: PantryItemCardProps) {
  if (variant === 'image') return <PantryImageCard item={item} onOptions={onOptions} />;

  return <PantryIconCard item={item} onOptions={onOptions} />;
}
