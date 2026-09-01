import { Skeleton } from '@/components/ui/skeleton';
import type { PantryCardVariant } from '@/entities/pantry/model/types';

interface PantryLoadingSkeletonProps {
  variant: PantryCardVariant;
}

function PantrySkeletonHeader({ variant }: PantryLoadingSkeletonProps) {
  return (
    <>
      <header className="flex h-12 items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton
            className={`h-8 rounded-full ${variant === 'image' ? 'w-[180px]' : 'w-[104px]'}`}
          />
        </div>
        <Skeleton className="h-8 w-[92px] rounded-lg" />
      </header>
      <div className="flex items-center justify-between px-4 pt-4 pb-4">
        <Skeleton className="h-[25px] w-10 rounded-full" />
        <Skeleton className="h-[25px] w-[72px] rounded-full" />
      </div>
    </>
  );
}

function PantryIconCardSkeleton() {
  return (
    <div className="bg-muted flex h-[104px] min-w-0 flex-col rounded-2xl px-2.5 py-3">
      <div className="flex items-start justify-between">
        <Skeleton className="size-10 rounded-lg" />
        <Skeleton className="h-4 w-7 rounded-full" />
      </div>
      <div className="mt-1 flex items-end justify-between">
        <div className="space-y-1">
          <Skeleton className="h-[18px] w-10 rounded-full" />
          <Skeleton className="h-[14px] w-[88px] rounded-full" />
        </div>
        <Skeleton className="size-6 rounded-full" />
      </div>
    </div>
  );
}

function PantryImageCardSkeleton() {
  return (
    <div className="bg-muted flex h-[203px] min-w-0 flex-col rounded-2xl p-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-7 rounded-full" />
        <Skeleton className="size-6 rounded-full" />
      </div>
      <Skeleton className="mx-auto mt-2 size-[100px] rounded-lg" />
      <div className="mt-2 space-y-1">
        <Skeleton className="h-[18px] w-10 rounded-full" />
        <Skeleton className="h-[14px] w-full rounded-full" />
      </div>
    </div>
  );
}

export function PantryLoadingSkeleton({ variant }: PantryLoadingSkeletonProps) {
  const CardSkeleton = variant === 'image' ? PantryImageCardSkeleton : PantryIconCardSkeleton;

  return (
    <section aria-busy="true" aria-label="팬트리 목록을 불러오는 중" role="status">
      <PantrySkeletonHeader variant={variant} />
      <div className={`grid grid-cols-2 px-4 pb-8 ${variant === 'image' ? 'gap-2' : 'gap-3'}`}>
        {Array.from({ length: 12 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
      <span className="sr-only">팬트리 목록을 불러오고 있습니다.</span>
    </section>
  );
}
