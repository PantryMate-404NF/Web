'use client';

import { useState } from 'react';
import Image from 'next/image';

const MAX_VISIBLE_PANTRY_ITEMS = 6;

export interface PantryCleanupItem {
  pantryItemId: number;
  name: string;
  imageUrl?: string | null;
}

interface PantryCleanupBottomSheetProps {
  errorMessage: string | null;
  isSubmitting: boolean;
  items: PantryCleanupItem[];
  onCleanup: () => void;
  onDefer: () => void;
  onToggle: (pantryItemId: number) => void;
  selectedItemIds: number[];
}

export function getPantryCleanupSuccessMessage(deletedCount: number) {
  return `총 ${deletedCount}개의 식재료가 삭제되었어요.`;
}

export function getPantryCleanupVisibleItems(items: PantryCleanupItem[], isExpanded: boolean) {
  return isExpanded ? items : items.slice(0, MAX_VISIBLE_PANTRY_ITEMS);
}

export function PantryCleanupBottomSheet({
  errorMessage,
  isSubmitting,
  items,
  onCleanup,
  onDefer,
  onToggle,
  selectedItemIds,
}: PantryCleanupBottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreItems = items.length > MAX_VISIBLE_PANTRY_ITEMS;
  const visibleItems = getPantryCleanupVisibleItems(items, isExpanded);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[var(--primitive-black)]/70">
      <section
        aria-labelledby="pantry-cleanup-title"
        aria-modal="true"
        className={`bg-background flex shrink-0 ${isExpanded ? 'h-[calc(100dvh-24px)]' : 'h-[482px]'} max-h-[100dvh] w-full max-w-[var(--layout-mobile-design-frame)] flex-col items-center overflow-clip rounded-t-[20px] pt-4 ${hasMoreItems ? 'gap-1 pb-[max(12px,env(safe-area-inset-bottom))]' : 'gap-2 pb-[max(16px,env(safe-area-inset-bottom))]'}`}
        role="dialog"
      >
        <div className="flex h-[34px] w-full items-center justify-center" aria-hidden="true">
          <span className="bg-surface-inverse mt-2 h-[5px] w-20 rounded-full" />
        </div>

        <div
          className={`flex min-h-0 w-full flex-col px-4 ${hasMoreItems ? 'pb-0' : 'pb-4'} ${isExpanded ? 'flex-1' : ''}`}
        >
          <h2 className="text-title-4 font-semibold" id="pantry-cleanup-title">
            <span className="block">요리 완성! 🎉</span>
            <span className="block">사용한 식재료를 정리할까요?</span>
          </h2>

          {items.length > 0 ? (
            <div
              className={`${hasMoreItems ? 'mt-2' : 'mt-4'} ${isExpanded ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain' : ''}`}
            >
              <ul className="grid grid-cols-3 gap-2">
                {visibleItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.pantryItemId);

                  return (
                    <li key={item.pantryItemId}>
                      <button
                        aria-label={`${item.name} 선택`}
                        aria-pressed={isSelected}
                        className={`relative flex h-[140px] w-full flex-col items-center justify-center rounded-xl border-[1.5px] px-3 ${
                          isSelected
                            ? 'border-[var(--primitive-primary-500)]'
                            : 'border-[var(--primitive-grey-200)]'
                        }`}
                        disabled={isSubmitting}
                        onClick={() => onToggle(item.pantryItemId)}
                        type="button"
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute top-1.5 right-1.5 z-10 grid size-6 place-items-center rounded-full ${
                            isSelected
                              ? 'bg-[var(--primitive-primary-400)] text-[var(--primitive-grey-800)]'
                              : 'bg-[var(--primitive-grey-200)] text-[var(--primitive-grey-400)]'
                          }`}
                        >
                          <Image
                            alt=""
                            aria-hidden="true"
                            height={18}
                            src={
                              isSelected
                                ? '/icons/recipe-cleanup-check-selected.svg'
                                : '/icons/recipe-cleanup-check-unselected.svg'
                            }
                            width={18}
                          />
                        </span>
                        <div className="bg-surface-secondary relative size-20 overflow-hidden rounded-lg">
                          <Image
                            alt=""
                            className="object-cover"
                            fill
                            sizes="80px"
                            src={item.imageUrl || '/images/pantry/ingredient-image-placeholder.png'}
                            unoptimized={Boolean(item.imageUrl)}
                          />
                        </div>
                        <span className="text-label-4 mt-1 w-20 truncate text-center font-medium">
                          {item.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-text-secondary mt-4 text-sm">정리할 팬트리 재료가 없어요.</p>
          )}

          {errorMessage ? (
            <p className="text-destructive mt-3 text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {hasMoreItems ? (
            <button
              aria-expanded={isExpanded}
              aria-label={
                isExpanded
                  ? '식재료 목록 접기'
                  : `식재료 ${items.length - MAX_VISIBLE_PANTRY_ITEMS}개 더보기`
              }
              className="text-text-secondary text-label-4 h-5 shrink-0 self-end font-medium"
              disabled={isSubmitting}
              onClick={() => setIsExpanded((expanded) => !expanded)}
              type="button"
            >
              {isExpanded ? '접기' : `더보기 (${items.length - MAX_VISIBLE_PANTRY_ITEMS}개)`}
            </button>
          ) : null}
        </div>

        <div className="flex w-full gap-2 px-4">
          <button
            className="text-title-4 h-12 flex-1 rounded-xl bg-[var(--primitive-grey-200)] font-semibold text-[var(--primitive-black)] disabled:opacity-50"
            disabled={isSubmitting}
            onClick={onDefer}
            type="button"
          >
            나중에
          </button>
          <button
            className="text-title-4 h-12 flex-1 rounded-xl bg-[var(--primitive-primary-500)] font-semibold text-[var(--primitive-black)] disabled:opacity-50"
            disabled={selectedItemIds.length === 0 || isSubmitting}
            onClick={onCleanup}
            type="button"
          >
            {isSubmitting ? '정리 중' : '정리하기'}
          </button>
        </div>
      </section>
    </div>
  );
}
