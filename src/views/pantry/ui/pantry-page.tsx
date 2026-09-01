import type { PantryCardVariant, PantryItem } from '@/entities/pantry/model/types';
import { pantryItems } from '@/entities/pantry/model/mock';
import { Button } from '@/components/ui/button';
import { PantryGrid } from '@/widgets/pantry-list/ui/pantry-grid';
import { PantryHeader } from '@/widgets/pantry-list/ui/pantry-header';
import { PantryLoadingSkeleton } from '@/widgets/pantry-list/ui/pantry-loading-skeleton';
import { PantryToolbar } from '@/widgets/pantry-list/ui/pantry-toolbar';

type PantryViewState = 'default' | 'loading' | 'empty' | 'error';

interface PantryPageProps {
  items?: PantryItem[];
  isLoading?: boolean;
  errorMessage?: string;
  cardVariant?: PantryCardVariant;
}

export function getPantryCardVariant(view?: string): PantryCardVariant {
  return view === 'image' ? 'image' : 'icon';
}

export function getPantryViewState({
  items,
  isLoading,
  errorMessage,
}: Required<Pick<PantryPageProps, 'items' | 'isLoading'>> &
  Pick<PantryPageProps, 'errorMessage'>): PantryViewState {
  if (errorMessage) return 'error';
  if (isLoading) return 'loading';
  if (items.length === 0) return 'empty';

  return 'default';
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

function PantryErrorState({ message }: { message: string }) {
  return (
    <section className="bg-card flex min-h-72 flex-col items-center justify-center rounded-2xl border px-6 text-center">
      <p className="text-title-3 font-semibold">팬트리를 불러오지 못했어요</p>
      <p className="text-body-4 text-muted-foreground mt-2">{message}</p>
      <Button className="mt-5" type="button" variant="outline">
        다시 시도
      </Button>
    </section>
  );
}

export function PantryPage({
  items = pantryItems,
  isLoading = false,
  errorMessage,
  cardVariant = 'icon',
}: PantryPageProps) {
  const viewState = getPantryViewState({ items, isLoading, errorMessage });

  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-[390px] pt-2 pb-10">
      {viewState === 'loading' ? (
        <PantryLoadingSkeleton variant={cardVariant} />
      ) : (
        <>
          <PantryHeader />
          <PantryToolbar itemCount={items.length} />

          {viewState === 'empty' && <PantryEmptyState />}
          {viewState === 'error' && (
            <PantryErrorState message={errorMessage ?? '잠시 후 다시 시도해 주세요.'} />
          )}
          {viewState === 'default' && <PantryGrid items={items} variant={cardVariant} />}
        </>
      )}
    </main>
  );
}
