import type { PantryItem } from '@/entities/pantry/model/types';
import { pantryItems } from '@/entities/pantry/model/mock';
import { Button } from '@/components/ui/button';
import { PantryGrid } from '@/widgets/pantry-list/ui/pantry-grid';
import { PantryHeader } from '@/widgets/pantry-list/ui/pantry-header';
import { PantryToolbar } from '@/widgets/pantry-list/ui/pantry-toolbar';

type PantryViewState = 'default' | 'loading' | 'empty' | 'error';

interface PantryPageProps {
  items?: PantryItem[];
  isLoading?: boolean;
  errorMessage?: string;
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

function PantryGridSkeleton() {
  return (
    <div aria-label="팬트리 목록을 불러오는 중" className="grid grid-cols-2 gap-3" role="status">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="bg-card h-40 animate-pulse rounded-2xl border p-3" key={index}>
          <div className="bg-muted size-10 rounded-lg" />
          <div className="bg-muted mt-8 h-4 w-2/3 rounded-full" />
          <div className="bg-muted mt-2 h-3 w-full rounded-full" />
        </div>
      ))}
      <span className="sr-only">팬트리 목록을 불러오고 있습니다.</span>
    </div>
  );
}

function PantryEmptyState() {
  return (
    <section className="bg-card flex min-h-72 flex-col items-center justify-center rounded-2xl border px-6 text-center">
      <p className="text-lg font-semibold">팬트리가 비어 있어요</p>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
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
      <p className="text-lg font-semibold">팬트리를 불러오지 못했어요</p>
      <p className="text-muted-foreground mt-2 text-sm leading-6">{message}</p>
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
}: PantryPageProps) {
  const viewState = getPantryViewState({ items, isLoading, errorMessage });

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[390px] bg-white pt-2 pb-10">
      <PantryHeader />
      <PantryToolbar itemCount={items.length} />

      {viewState === 'loading' && <PantryGridSkeleton />}
      {viewState === 'empty' && <PantryEmptyState />}
      {viewState === 'error' && (
        <PantryErrorState message={errorMessage ?? '잠시 후 다시 시도해 주세요.'} />
      )}
      {viewState === 'default' && <PantryGrid items={items} />}
    </main>
  );
}
