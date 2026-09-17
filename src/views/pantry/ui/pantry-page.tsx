'use client';

import { ChevronDown, ChevronLeft, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { usePantryMutations } from '@/entities/pantry/api/use-pantry-mutations';
import {
  filterPantryItems,
  sortPantryItems,
  usePantryStore,
} from '@/entities/pantry/model/pantry-store';
import type {
  PantryCardVariant,
  PantryItem,
  PantrySortOption,
  PantryStorageType,
} from '@/entities/pantry/model/types';
import { PantryItemCard } from '@/entities/pantry/ui/pantry-item-card';
import type { DataViewState } from '@/shared/model/ui-state';
import { PantryLoadingSkeleton } from '@/widgets/pantry-list/ui/pantry-loading-skeleton';

type PantryViewState = Extract<DataViewState, 'content' | 'empty' | 'error' | 'loading'>;
type StorageFilter = PantryStorageType | 'ALL';

const filters: { label: string; value: StorageFilter }[] = [
  { label: '전체', value: 'ALL' },
  { label: '냉장', value: 'REFRIGERATED' },
  { label: '냉동', value: 'FROZEN' },
  { label: '실온', value: 'ROOM_TEMP' },
];

const sortLabels: Record<PantrySortOption, string> = {
  RECENT: '최근 등록순',
  IMMINENT: '소비기한 임박순',
  OLDEST: '오래된 등록순',
};

const PANTRY_MENU_WIDTH = 123;

interface PantryMenuTriggerRect {
  left: number;
  right: number;
  top: number;
}

export function getPantryMenuPosition(trigger: PantryMenuTriggerRect, viewportWidth: number) {
  const rightSidePosition = trigger.right - 7;
  const left =
    rightSidePosition + PANTRY_MENU_WIDTH <= viewportWidth - 16
      ? rightSidePosition
      : Math.max(8, trigger.left - PANTRY_MENU_WIDTH + 7);

  return { left, top: trigger.top - 4 };
}

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

export function getVisiblePantryItems(
  items: PantryItem[],
  query: string,
  storage: StorageFilter,
  sort: PantrySortOption,
) {
  const searched = items.filter((item) => item.name.includes(query.trim()));
  return sortPantryItems(
    filterPantryItems(searched, storage === 'ALL' ? undefined : storage),
    sort,
  );
}

export function getDeleteConfirmationTitle(itemName: string) {
  const lastCharacter = itemName.at(-1);
  const codePoint = lastCharacter?.charCodeAt(0) ?? 0;
  const hasFinalConsonant =
    codePoint >= 0xac00 && codePoint <= 0xd7a3 && (codePoint - 0xac00) % 28 !== 0;
  return `${itemName}${hasFinalConsonant ? '을' : '를'} 삭제할까요?`;
}

export function PantryErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <section className="px-4 pt-28 text-center" role="alert">
      <p className="text-title-3 font-semibold">팬트리를 불러오지 못했어요</p>
      <p className="text-body-4 text-muted-foreground mt-2">{message}</p>
      <Button className="mt-5" onClick={onRetry} type="button" variant="outline">
        다시 시도
      </Button>
    </section>
  );
}

export function PantryEmptyState() {
  return (
    <section
      aria-label="등록된 식재료 없음"
      className="absolute top-[269px] left-1/2 flex w-[184px] -translate-x-1/2 flex-col items-center gap-4 text-center"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="rounded-xl object-cover"
        height={160}
        src="/images/pantry/empty-image.svg"
        width={160}
      />
      <div className="text-disabled text-title-4 w-full leading-6">
        <h2 className="font-semibold">아직 등록된 식재료가 없어요</h2>
        <p className="font-normal">식재료를 등록해 보세요</p>
      </div>
    </section>
  );
}

export function PantryFilterEmptyState() {
  return (
    <section aria-live="polite" className="text-muted-foreground px-4 pt-24 text-center">
      <h2 className="text-title-4 font-semibold">조건에 맞는 식재료가 없어요</h2>
      <p className="text-body-4 mt-2">검색어나 보관 방법을 다시 확인해 주세요.</p>
    </section>
  );
}

interface PantryDeleteDialogProps {
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
  dialogRef: RefObject<HTMLElement | null>;
}

export function PantryDeleteDialog({
  itemName,
  onCancel,
  onConfirm,
  dialogRef,
}: PantryDeleteDialogProps) {
  return (
    <section
      aria-labelledby="delete-title"
      aria-modal={true}
      className="bg-card fixed top-[245px] left-1/2 flex h-[212px] w-[308px] -translate-x-1/2 flex-col items-center gap-[18px] rounded-[20px] py-8 outline-none"
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      <div className="text-title-4 flex w-40 flex-col items-center gap-3 text-center">
        <h2 className="w-full font-bold" id="delete-title">
          {getDeleteConfirmationTitle(itemName)}
        </h2>
        <p className="text-muted-foreground w-full font-medium">
          삭제하면 팬트리에서 다시
          <br />
          확인할 수 없어요.
        </p>
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        <button
          className="bg-surface-secondary text-disabled text-title-4 flex h-[51px] w-[130px] items-center justify-center rounded-full font-semibold"
          onClick={onCancel}
          type="button"
        >
          닫기
        </button>
        <button
          className="bg-primary text-title-4 flex h-[51px] w-[130px] items-center justify-center rounded-full font-semibold"
          onClick={onConfirm}
          type="button"
        >
          삭제하기
        </button>
      </div>
    </section>
  );
}

export function PantryPage({
  items,
  errorMessage,
  cardVariant = 'image',
  isLoading = false,
  onRetry,
}: PantryPageProps) {
  const storedItems = usePantryStore((state) => state.items);
  const { remove: removePantryItem } = usePantryMutations();
  const currentItems = items ?? storedItems;
  const [query, setQuery] = useState('');
  const [storage, setStorage] = useState<StorageFilter>('ALL');
  const [sort, setSort] = useState<PantrySortOption>('RECENT');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [menuItem, setMenuItem] = useState<PantryItem | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ left: number; top: number } | null>(null);
  const [deleteItem, setDeleteItem] = useState<PantryItem | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const deleteDialogRef = useRef<HTMLElement>(null);
  const addItemLinkRef = useRef<HTMLAnchorElement>(null);
  const visibleItems = getVisiblePantryItems(currentItems, query, storage, sort);
  const viewState = getPantryViewState({ items: currentItems, errorMessage, isLoading });

  function closeDeleteDialog() {
    setDeleteItem(null);
    menuTriggerRef.current?.focus();
  }

  useEffect(() => {
    if (!menuItem) return;
    const menu = menuRef.current;
    const controls = menu
      ? Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'))
      : [];
    menu?.focus();

    function closeMenu() {
      setMenuItem(null);
      setMenuPosition(null);
      menuTriggerRef.current?.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab' || controls.length === 0) return;
      const first = controls[0];
      const last = controls.at(-1);
      if (document.activeElement === menu) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuItem]);

  useEffect(() => {
    if (!deleteItem) return;
    const dialog = deleteDialogRef.current;
    const controls = dialog
      ? Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
      : [];
    dialog?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDeleteDialog();
        return;
      }
      if (event.key !== 'Tab' || controls.length === 0) return;
      const first = controls[0];
      const last = controls.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteItem]);

  if (viewState === 'loading') return <PantryLoadingSkeleton variant={cardVariant} />;
  if (viewState === 'error')
    return (
      <PantryErrorState message={errorMessage ?? '잠시 후 다시 시도해 주세요.'} onRetry={onRetry} />
    );

  return (
    <main className="mobile-page bg-background relative flex min-h-dvh flex-col pb-24">
      <header className="flex h-16 w-full items-center">
        <div className="flex h-full w-[calc(100%_-_16px)] max-w-[374px] items-center">
          <Link
            aria-label="이전 페이지"
            className="grid size-10 shrink-0 place-items-center"
            href="/"
          >
            <ChevronLeft className="size-6" />
          </Link>
          <label className="border-border focus-within:ring-ring ml-0.5 flex h-[42px] w-[274px] shrink-0 items-center rounded-full border px-1.5 focus-within:ring-2">
            <span className="grid size-10 shrink-0 place-items-center">
              <Search aria-hidden="true" className="text-muted-foreground size-6" />
            </span>
            <span className="sr-only">식재료 검색</span>
            <input
              className="text-title-4 min-w-0 flex-1 bg-transparent font-medium outline-none"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="검색"
              value={query}
            />
          </label>
          <Button
            asChild
            className="ml-[18px] size-10 shrink-0 rounded-full p-0 has-[>svg]:p-0"
            size="icon"
          >
            <Link href="/pantry?state=register" ref={addItemLinkRef}>
              <Plus className="size-6" />
              <span className="sr-only">재료 추가</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="relative flex h-12 items-center justify-between pr-1 pl-4">
        <strong className="text-title-3 leading-[27px] font-semibold">
          {visibleItems.length}개
        </strong>
        <button
          className="text-label-2 flex h-10 w-max shrink-0 items-center justify-end font-medium"
          onClick={() => setIsSortOpen((value) => !value)}
          type="button"
        >
          <span className="whitespace-nowrap">{sortLabels[sort]}</span>
          <span className="grid size-10 shrink-0 place-items-center">
            <ChevronDown className="size-6" />
          </span>
        </button>
        {isSortOpen ? (
          <div className="bg-card absolute top-10 right-0 z-20 w-max min-w-[134px] space-y-4 rounded-xl p-4 shadow-[0_4px_4px_rgb(26_26_26/16%),0_0_2px_rgb(26_26_26/12%)]">
            {(['RECENT', 'IMMINENT', 'OLDEST'] as const).map((option) => (
              <button
                className="block w-full text-left text-base font-medium whitespace-nowrap"
                key={option}
                onClick={() => {
                  setSort(option);
                  setIsSortOpen(false);
                }}
                type="button"
              >
                {sortLabels[option]}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className="mx-4 flex h-9 w-[calc(100%_-_32px)] items-start gap-1.5"
        role="group"
        aria-label="보관 방법 필터"
      >
        {filters.map((filter) => (
          <button
            aria-pressed={storage === filter.value}
            className={`h-7 rounded-full border-1 px-3 text-xs leading-[18px] font-medium ${storage === filter.value ? 'bg-foreground text-background border-foreground' : 'text-muted-foreground border-muted-foreground'}`}
            key={filter.value}
            onClick={() => setStorage(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {viewState === 'empty' ? (
        <PantryEmptyState />
      ) : visibleItems.length === 0 ? (
        <PantryFilterEmptyState />
      ) : (
        <section
          aria-label="팬트리 식재료 목록"
          className="mx-4 grid w-[calc(100%_-_32px)] grid-cols-2 gap-3 pb-8"
        >
          {visibleItems.map((item) => (
            <PantryItemCard
              item={item}
              key={item.id}
              onOptions={(trigger) => {
                menuTriggerRef.current = trigger;
                setMenuItem(item);
                setMenuPosition(
                  getPantryMenuPosition(trigger.getBoundingClientRect(), window.innerWidth),
                );
              }}
              variant={cardVariant}
            />
          ))}
        </section>
      )}

      {menuItem && menuPosition ? (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setMenuItem(null);
            setMenuPosition(null);
            menuTriggerRef.current?.focus();
          }}
          role="presentation"
        >
          <div
            aria-label={`${menuItem.name} 관리`}
            className="bg-card absolute flex h-24 w-[123px] flex-col rounded-xl py-2 pr-4 pl-2 shadow-[0_4px_4px_rgb(26_26_26/16%),0_0_2px_rgb(26_26_26/12%)] outline-none"
            onClick={(event) => event.stopPropagation()}
            ref={menuRef}
            role="menu"
            style={menuPosition}
            tabIndex={-1}
          >
            <Link
              className="text-label-2 flex h-10 items-center font-medium"
              href={`/pantry?state=edit&id=${menuItem.id}`}
              role="menuitem"
            >
              <span className="grid size-10 shrink-0 place-items-center">
                <Pencil aria-hidden="true" className="size-6" />
              </span>
              <span>수정하기</span>
            </Link>
            <button
              className="text-label-2 flex h-10 items-center text-left font-medium"
              onClick={() => {
                setDeleteItem(menuItem);
                setMenuItem(null);
                setMenuPosition(null);
              }}
              role="menuitem"
              type="button"
            >
              <span className="grid size-10 shrink-0 place-items-center">
                <Trash2 aria-hidden="true" className="size-6" />
              </span>
              <span>삭제하기</span>
            </button>
          </div>
        </div>
      ) : null}

      {deleteItem ? (
        <div className="bg-overlay/80 fixed inset-y-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2">
          <PantryDeleteDialog
            dialogRef={deleteDialogRef}
            itemName={deleteItem.name}
            onCancel={closeDeleteDialog}
            onConfirm={() => {
              const deletedItemId = deleteItem.id;
              void removePantryItem.mutateAsync(deletedItemId).then(() => {
                setDeleteItem(null);
                requestAnimationFrame(() => addItemLinkRef.current?.focus());
              });
            }}
          />
        </div>
      ) : null}
    </main>
  );
}
