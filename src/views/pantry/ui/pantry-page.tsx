'use client';

import type { PantryCardVariant, PantryItem } from '@/entities/pantry/model/types';
import { usePantryStore } from '@/entities/pantry/model/pantry-store';
import { Button } from '@/components/ui/button';
import { PantryGrid } from '@/widgets/pantry-list/ui/pantry-grid';
import { PantryHeader } from '@/widgets/pantry-list/ui/pantry-header';
import { PantryLoadingSkeleton } from '@/widgets/pantry-list/ui/pantry-loading-skeleton';
import { PantryToolbar } from '@/widgets/pantry-list/ui/pantry-toolbar';
import type { DataViewState } from '@/shared/model/ui-state';

type PantryViewState = Extract<DataViewState, 'content' | 'empty' | 'error' | 'loading'>;

interface PantryPageProps {
  items?: PantryItem[];
  errorMessage?: string;
  cardVariant?: PantryCardVariant;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function getPantryViewState({
  items,
  errorMessage,
  isLoading = false,
}: Required<Pick<PantryPageProps, 'items'>> &
  Pick<PantryPageProps, 'errorMessage' | 'isLoading'>): PantryViewState {
  if (errorMessage) return 'error';
  if (isLoading) return 'loading';
  if (items.length === 0) return 'empty';

  return 'content';
}

function PantryEmptyState() {
  return (
    <section className="bg-card flex min-h-72 flex-col items-center justify-center rounded-2xl border px-6 text-center">
      <p className="text-title-3 font-semibold">팬트리가 비어 있어요</p>
      <p className="text-body-4 text-muted-foreground mt-2">
        보유한 식재료를 등록하면
        <br />
        활용할 수 있는 레시피를 추천해 드릴게요.
      </p>
      <Button className="mt-5" type="button">
        식재료 추가
      </Button>
    </section>
  );
}

function PantryErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <section
      aria-live="polite"
      className="bg-card flex min-h-72 flex-col items-center justify-center rounded-2xl border px-6 text-center"
      role="alert"
    >
      <p className="text-title-3 font-semibold">팬트리를 불러오지 못했어요</p>
      <p className="text-body-4 text-muted-foreground mt-2">{message}</p>
      <Button className="mt-5" onClick={onRetry} type="button" variant="outline">
        다시 시도
      </Button>
    </section>
  );
}

export function PantryPage({
  items,
  errorMessage,
  cardVariant = 'icon',
  isLoading = false,
  onRetry,
}: PantryPageProps) {
  const storedItems = usePantryStore((state) => state.items);
  const currentItems = items ?? storedItems;
  const viewState = getPantryViewState({ items: currentItems, errorMessage, isLoading });

  if (viewState === 'loading') return <PantryLoadingSkeleton variant={cardVariant} />;

  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-[390px] pt-2 pb-10">
      <PantryHeader />
      <PantryToolbar itemCount={currentItems.length} />

      {viewState === 'empty' && <PantryEmptyState />}
      {viewState === 'error' && (
        <PantryErrorState
          message={errorMessage ?? '잠시 후 다시 시도해 주세요.'}
          onRetry={onRetry}
        />
      )}
      {viewState === 'content' && <PantryGrid items={currentItems} variant={cardVariant} />}
    </main>
  );
}
