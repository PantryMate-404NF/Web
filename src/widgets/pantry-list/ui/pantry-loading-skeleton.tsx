import { ChevronLeft, MoreHorizontal } from 'lucide-react';

import type { PantryCardVariant } from '@/entities/pantry/model/types';
import { Skeleton } from '@/shared/ui/skeleton';

interface PantryLoadingSkeletonProps {
  variant?: PantryCardVariant;
}

const iconCards = Array.from({ length: 12 }, (_, index) => `icon-card-${index}`);
const imageCards = Array.from({ length: 8 }, (_, index) => `image-card-${index}`);

function PantryLoadingHeader({ variant }: Required<PantryLoadingSkeletonProps>) {
  return (
    <>
      <header
        aria-label="팬트리 불러오는 중"
        className="flex h-12 items-center justify-between px-4 py-2"
      >
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-8 items-center justify-center" aria-hidden="true">
            <ChevronLeft className="size-5" />
          </span>
          <Skeleton
            className={`h-8 rounded-full ${variant === 'image' ? 'w-[180px]' : 'w-[104px]'}`}
          />
        </div>
        <Skeleton className="h-8 w-[92px] shrink-0 rounded-lg" />
      </header>
      <section
        aria-label="팬트리 목록 도구를 불러오는 중"
        className="flex items-center justify-between px-4 pt-4 pb-4"
      >
        <Skeleton className="h-[25px] w-10 rounded-full" />
        <Skeleton className="h-[25px] w-[72px] rounded-full" />
      </section>
    </>
  );
}

function PantryIconLoadingCard() {
  return (
    <article className="bg-skeleton-container flex h-[104px] min-w-0 flex-col rounded-2xl px-2.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <Skeleton animated className="size-10 shrink-0 rounded" />
        <Skeleton className="h-4 w-7 rounded-full" />
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="space-y-1">
          <Skeleton className="h-[18px] w-10 rounded-full" />
          <Skeleton className="h-3.5 w-[88px] rounded-full" />
        </div>
        <MoreHorizontal aria-hidden="true" className="size-6" />
      </div>
    </article>
  );
}

function PantryImageLoadingCard() {
  return (
    <article className="bg-skeleton-container flex h-[203px] min-w-0 flex-col rounded-2xl px-[5px] py-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-7 rounded-full" />
        <MoreHorizontal aria-hidden="true" className="size-[26px]" />
      </div>
      <Skeleton animated className="mx-auto mt-1 size-[100px] rounded-lg" />
      <div className="mt-2 space-y-[7px] px-1">
        <Skeleton className="h-[18px] w-10 rounded-full" />
        <Skeleton className="h-3.5 w-full rounded-full" />
      </div>
    </article>
  );
}

export function PantryLoadingSkeleton({ variant = 'icon' }: PantryLoadingSkeletonProps) {
  const isImageVariant = variant === 'image';

  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-[390px] pt-2 pb-10">
      <PantryLoadingHeader variant={variant} />
      <section
        aria-busy="true"
        aria-label="팬트리 식재료 목록을 불러오는 중"
        className={`grid grid-cols-2 px-4 pb-8 ${isImageVariant ? 'gap-2' : 'gap-3'}`}
      >
        {(isImageVariant ? imageCards : iconCards).map((cardKey) =>
          isImageVariant ? (
            <PantryImageLoadingCard key={cardKey} />
          ) : (
            <PantryIconLoadingCard key={cardKey} />
          ),
        )}
      </section>
    </main>
  );
}
