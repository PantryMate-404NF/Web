'use client';

/** 팬트리 조회와 등록·수정·목업 화면 흐름을 조합함 */

import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getPantryExpirationPresentation } from '@/entities/pantry/model/expiration';
import { upsertPantryItem, usePantryStore } from '@/entities/pantry/model/pantry-store';
import { getPantryCardVariant } from '@/entities/pantry/model/types';
import type {
  PantryCardVariant,
  PantryItem,
  PantryStorageType,
} from '@/entities/pantry/model/types';
import { PANTRY_QUERY_KEY, usePantryQuery } from '@/views/pantry/model/use-pantry-query';
import { PantryPage } from '@/views/pantry/ui/pantry-page';

export type PantryMockState =
  'empty' | 'full' | 'loading' | 'delivery-complete' | 'register' | 'edit' | 'delete-confirm';

interface PantryFlowPageProps {
  itemId?: string;
  state?: string;
  view?: string;
}

export { getPantryExpirationPresentation } from '@/entities/pantry/model/expiration';

export function getPantryMockState(state?: string): PantryMockState {
  if (
    state === 'empty' ||
    state === 'loading' ||
    state === 'delivery-complete' ||
    state === 'register' ||
    state === 'edit' ||
    state === 'delete-confirm'
  ) {
    return state;
  }

  return 'full';
}

export function isIngredientFormSubmittable(
  ingredientName: string,
  storageType: PantryStorageType | null,
) {
  return ingredientName.trim().length > 0 && storageType !== null;
}

export function getCalendarMonthCells(year: number, monthIndex: number) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
}

export function formatPantryDate(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getCalendarSelection(date: string, fallbackDate = new Date()) {
  const [year, month, day] = date.split('-').map(Number);
  const hasValidDate = Boolean(year && month && day);
  const selectedDate = hasValidDate ? new Date(year, month - 1, day) : fallbackDate;

  return {
    selectedDay: selectedDate.getDate(),
    visibleMonth: { year: selectedDate.getFullYear(), monthIndex: selectedDate.getMonth() },
  };
}

interface IngredientFormMockProps {
  itemId?: string;
  items?: PantryItem[];
  mode: 'register' | 'edit';
}

function IngredientFormMock({ mode, itemId, items }: IngredientFormMockProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const storedItems = usePantryStore((state) => state.items);
  const upsertItem = usePantryStore((state) => state.upsertItem);
  const currentItems = items ?? storedItems;
  const editingItem = mode === 'edit' ? currentItems.find((item) => item.id === itemId) : undefined;
  const [ingredientName, setIngredientName] = useState(editingItem?.name ?? '');
  const [storageType, setStorageType] = useState<PantryStorageType | null>(
    editingItem?.storageType ?? null,
  );
  const [expirationDate, setExpirationDate] = useState(editingItem?.expirationDate ?? '');
  const [consumptionDate, setConsumptionDate] = useState(editingItem?.consumptionDate ?? '');
  const [activeDateField, setActiveDateField] = useState<'expiration' | 'consumption'>(
    'expiration',
  );
  const initialCalendarSelection = getCalendarSelection('');
  const [visibleMonth, setVisibleMonth] = useState(initialCalendarSelection.visibleMonth);
  const [selectedDay, setSelectedDay] = useState(initialCalendarSelection.selectedDay);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarDialogRef = useRef<HTMLElement>(null);
  const calendarTriggerRef = useRef<HTMLButtonElement | null>(null);
  const isEdit = mode === 'edit';
  const canSubmit =
    isIngredientFormSubmittable(ingredientName, storageType) && (!isEdit || Boolean(editingItem));
  const calendarCells = getCalendarMonthCells(visibleMonth.year, visibleMonth.monthIndex);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || !storageType || (isEdit && !editingItem)) return;

    const expirationPresentation = getPantryExpirationPresentation(consumptionDate);

    const nextItem: PantryItem = {
      id: editingItem?.id ?? `manual-${Date.now()}`,
      name: ingredientName.trim(),
      ...expirationPresentation,
      expirationDate: expirationDate || undefined,
      consumptionDate: consumptionDate || undefined,
      availability: 'AVAILABLE',
      imageAlt: `${ingredientName.trim()} 이미지`,
      storageType,
      registrationSource: editingItem?.registrationSource ?? 'MANUAL',
      createdAt: editingItem?.createdAt ?? new Date().toISOString(),
      imageUrl: editingItem?.imageUrl,
    };

    upsertItem(nextItem);
    queryClient.setQueryData<PantryItem[]>(PANTRY_QUERY_KEY, (cachedItems) =>
      upsertPantryItem(cachedItems ?? currentItems, nextItem),
    );
    router.push('/pantry');
  }

  function openCalendar(
    field: 'expiration' | 'consumption',
    date: string,
    trigger: HTMLButtonElement,
  ) {
    const selection = getCalendarSelection(date);
    calendarTriggerRef.current = trigger;
    setActiveDateField(field);
    setVisibleMonth(selection.visibleMonth);
    setSelectedDay(selection.selectedDay);
    setIsCalendarOpen(true);
  }

  function closeCalendar() {
    setIsCalendarOpen(false);
    calendarTriggerRef.current?.focus();
  }

  function moveCalendarMonth(offset: number) {
    const nextMonth = new Date(visibleMonth.year, visibleMonth.monthIndex + offset, 1);
    setVisibleMonth({ year: nextMonth.getFullYear(), monthIndex: nextMonth.getMonth() });
    setSelectedDay(1);
  }

  useEffect(() => {
    if (!isCalendarOpen) return;

    const dialog = calendarDialogRef.current;
    const focusableElements = dialog
      ? Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href]'))
      : [];

    dialog?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeCalendar();
        return;
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (
        event.shiftKey &&
        (document.activeElement === firstElement || document.activeElement === dialog)
      ) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCalendarOpen]);

  return (
    <main className="mobile-page bg-background min-h-dvh pb-10">
      <header className="flex h-16 w-full items-center gap-0.5">
        <Link
          aria-label="이전 페이지"
          className="grid size-10 shrink-0 place-items-center"
          href="/pantry"
        >
          <ChevronLeft aria-hidden="true" className="size-6" />
        </Link>
        <h1 className="text-title-3 font-semibold">식재료 관리</h1>
      </header>

      <form className="mx-4 mt-2 w-[calc(100%_-_32px)]" onSubmit={handleSubmit}>
        <div className="flex h-20 items-start justify-between">
          <button
            aria-label="식재료 이미지 추가"
            className="relative size-20 overflow-hidden rounded-sm"
            type="button"
          >
            <Image
              alt="식재료 이미지 추가"
              className="object-cover"
              fill
              sizes="80px"
              src="/images/pantry/ingredient-image-placeholder.png"
            />
          </button>

          <button
            className="bg-surface-secondary text-muted-foreground flex h-[42px] items-center rounded-sm border pr-2.5 text-sm leading-[21px] font-medium"
            type="button"
          >
            <span className="grid size-10 place-items-center">
              <Image
                alt=""
                aria-hidden="true"
                height={24}
                src="/icons/pantry/camera.svg"
                unoptimized
                width={24}
              />
            </span>
            영수증 찍기
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-title-4 flex items-start gap-1.5 font-medium"
              htmlFor="pantry-ingredient-name"
            >
              식재료명
              <span aria-hidden="true" className="text-destructive text-sm leading-[14px]">
                *
              </span>
            </label>
            <span className="relative">
              <input
                className="bg-surface-secondary text-title-4 focus-visible:ring-ring placeholder:text-disabled h-[52px] w-full rounded-xl border px-4 pr-14 font-normal outline-none focus-visible:ring-2"
                id="pantry-ingredient-name"
                maxLength={20}
                name="ingredientName"
                onChange={(event) => setIngredientName(event.target.value)}
                placeholder="식재료명을 입력해주세요"
                value={ingredientName}
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm leading-[21px] [color:var(--text-disabled)]">
                {ingredientName.length}/20
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-title-4 font-medium">유통기한</p>
            <button
              aria-label="유통기한 선택"
              className="bg-surface-secondary text-title-4 focus-visible:ring-ring flex h-[52px] w-full items-center rounded-xl border px-1.5 text-left font-normal outline-none focus-visible:ring-2"
              onClick={(event) => {
                openCalendar('expiration', expirationDate, event.currentTarget);
              }}
              type="button"
            >
              <span className="grid size-10 shrink-0 place-items-center">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={24}
                  src="/icons/pantry/calendar.svg"
                  unoptimized
                  width={24}
                />
              </span>
              <span className={expirationDate ? '' : 'text-disabled'}>
                {expirationDate || '상품에 표시된 기한을 입력해주세요'}
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-title-4 font-medium">소비기한</p>
            <button
              aria-label="소비기한 선택"
              className="bg-surface-secondary text-title-4 focus-visible:ring-ring flex h-[52px] w-full items-center rounded-xl border px-1.5 text-left font-normal outline-none focus-visible:ring-2"
              onClick={(event) => {
                openCalendar('consumption', consumptionDate, event.currentTarget);
              }}
              type="button"
            >
              <span className="grid size-10 shrink-0 place-items-center">
                <Image
                  alt=""
                  aria-hidden="true"
                  height={24}
                  src="/icons/pantry/calendar.svg"
                  unoptimized
                  width={24}
                />
              </span>
              <span className={consumptionDate ? '' : 'text-disabled'}>
                {consumptionDate || '상품에 표시된 기한을 입력해주세요'}
              </span>
            </button>
          </div>

          <fieldset>
            <legend className="text-title-4 font-medium">보관방법</legend>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {(
                [
                  ['냉장', 'REFRIGERATED', '/icons/pantry/refrigerated.svg', 'h-[15px] w-[11px]'],
                  ['냉동', 'FROZEN', '/icons/pantry/frozen.svg', 'h-4 w-[14px]'],
                  ['실온', 'ROOM_TEMP', '/icons/pantry/room-temperature.svg', 'size-4'],
                ] as const
              ).map(([label, type, iconSrc, iconClassName]) => (
                <button
                  className={
                    storageType === type
                      ? 'bg-primary/15 border-primary text-title-4 flex h-[52px] items-center justify-center gap-1.5 rounded-sm border font-medium'
                      : 'bg-surface-secondary text-disabled text-title-4 flex h-[52px] items-center justify-center gap-1.5 rounded-sm border font-medium'
                  }
                  key={type}
                  onClick={() => setStorageType(type)}
                  aria-pressed={storageType === type}
                  type="button"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className={iconClassName}
                    height={16}
                    src={iconSrc}
                    unoptimized
                    width={16}
                  />
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <Button
          className={
            canSubmit
              ? 'text-title-3 mt-[83px] h-[60px] w-full rounded-xl font-semibold'
              : 'bg-surface-disabled text-title-3 mt-[83px] h-[60px] w-full rounded-xl font-semibold [color:var(--text-disabled)] disabled:opacity-100'
          }
          disabled={!canSubmit}
          type="submit"
        >
          {isEdit ? '수정하기' : '등록하기'}
        </Button>
      </form>
      {isCalendarOpen && (
        <div className="fixed inset-0 z-20 overflow-hidden" role="presentation">
          <section
            aria-labelledby="calendar-title"
            aria-modal="true"
            className="bg-background fixed bottom-0 left-1/2 h-[562px] w-full max-w-[390px] -translate-x-1/2 rounded-t-[20px] outline-none"
            ref={calendarDialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="absolute top-6 right-5 left-5 flex h-10 items-center justify-between">
              <h2 className="text-title-3 font-semibold" id="calendar-title">
                날짜 선택
              </h2>
              <button
                aria-label="날짜 선택 닫기"
                className="grid size-10 place-items-center"
                onClick={closeCalendar}
                type="button"
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  height={14}
                  src="/icons/pantry/calendar-close.svg"
                  unoptimized
                  width={14}
                />
              </button>
            </div>

            <div className="absolute top-[74px] right-5 left-5 h-10">
              <strong className="text-title-3 absolute top-1.5 left-[108px] font-semibold">
                {visibleMonth.year}년 {String(visibleMonth.monthIndex + 1).padStart(2, '0')}월
              </strong>
              <div className="absolute top-0 right-0 flex items-center">
                <button
                  aria-label="이전 달"
                  className="grid size-10 place-items-center"
                  onClick={() => moveCalendarMonth(-1)}
                  type="button"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={10}
                    src="/icons/pantry/calendar-previous.svg"
                    unoptimized
                    width={6}
                  />
                </button>
                <button
                  aria-label="다음 달"
                  className="grid size-10 place-items-center"
                  onClick={() => moveCalendarMonth(1)}
                  type="button"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    height={10}
                    src="/icons/pantry/calendar-next.svg"
                    unoptimized
                    width={6}
                  />
                </button>
              </div>
            </div>

            <div className="text-label-4 absolute top-[132px] left-1/2 grid h-[21px] w-[calc(100%_-_54px)] max-w-[336px] -translate-x-1/2 grid-cols-7 text-center font-normal">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <span
                  className={
                    index === 0
                      ? 'text-status-danger'
                      : index === 6
                        ? 'text-status-info'
                        : 'text-muted-foreground'
                  }
                  key={day}
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="text-title-4 absolute top-[169px] left-1/2 grid w-[calc(100%_-_54px)] max-w-[336px] -translate-x-1/2 auto-rows-[24px] grid-cols-7 gap-y-[22px] text-center font-normal">
              {calendarCells.map((day, index) =>
                day === null ? (
                  <span aria-hidden="true" key={`empty-${index}`} />
                ) : (
                  <span className="flex items-center justify-center" key={day}>
                    <button
                      aria-label={`${visibleMonth.monthIndex + 1}월 ${day}일`}
                      aria-pressed={day === selectedDay}
                      className={
                        day === selectedDay
                          ? 'bg-surface-selected text-surface-selected-foreground grid size-9 shrink-0 place-items-center rounded-full'
                          : index % 7 === 0
                            ? 'text-status-danger grid size-9 shrink-0 place-items-center rounded-full'
                            : index % 7 === 6
                              ? 'text-status-info grid size-9 shrink-0 place-items-center rounded-full'
                              : 'grid size-9 shrink-0 place-items-center rounded-full'
                      }
                      onClick={() => setSelectedDay(day)}
                      type="button"
                    >
                      {day}
                    </button>
                  </span>
                ),
              )}
            </div>

            <Button
              className="text-title-3 absolute bottom-[49px] left-1/2 h-14 w-[calc(100%_-_54px)] max-w-[336px] -translate-x-1/2 rounded-xl font-semibold"
              onClick={() => {
                const selectedDate = formatPantryDate(
                  visibleMonth.year,
                  visibleMonth.monthIndex,
                  selectedDay,
                );
                if (activeDateField === 'expiration') setExpirationDate(selectedDate);
                else setConsumptionDate(selectedDate);
                closeCalendar();
              }}
              type="button"
            >
              선택 완료
            </Button>
          </section>
        </div>
      )}
    </main>
  );
}

function DeliveryCompleteDialog() {
  return (
    <div
      aria-label="배송 완료 식재료 등록"
      aria-modal="true"
      className="bg-overlay/40 fixed inset-0 z-10 flex items-end p-4"
      role="dialog"
    >
      <section className="bg-card mx-auto w-full max-w-[var(--layout-mobile-design-frame)] rounded-3xl p-6">
        <CheckCircle2 aria-hidden="true" className="text-primary size-10" />
        <h2 className="text-title-3 mt-4 font-semibold">배송이 완료됐어요</h2>
        <p className="text-body-4 text-muted-foreground mt-2">
          주문한 식재료를 팬트리에 자동 등록할까요?
          <br />
          소비기한은 나중에 수정할 수 있어요.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button asChild variant="outline">
            <Link href="/pantry?state=full">나중에</Link>
          </Button>
          <Button asChild>
            <Link href="/pantry?state=full">자동 등록하기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function DeleteConfirmSheet() {
  return (
    <div
      aria-label="식재료 삭제 확인"
      aria-modal="true"
      className="bg-overlay/40 fixed inset-0 z-10 flex items-end"
      role="dialog"
    >
      <section className="bg-card w-full rounded-t-3xl p-6 pb-8">
        <div className="bg-muted mx-auto h-1.5 w-12 rounded-full" />
        <h2 className="text-title-3 mt-6 font-semibold">대파를 팬트리에서 삭제할까요?</h2>
        <p className="text-body-4 text-muted-foreground mt-2">
          삭제한 식재료는 레시피 추천에 반영되지 않아요.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button asChild variant="outline">
            <Link href="/pantry?state=full">취소</Link>
          </Button>
          <Button asChild variant="destructive">
            <Link href="/pantry?state=full">삭제하기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function EditIngredientForm({ itemId }: { itemId?: string }) {
  const { data, error, isPending, refetch } = usePantryQuery();

  if (isPending) return <PantryPage isLoading items={[]} />;

  if (error) {
    return (
      <PantryPage
        errorMessage={error instanceof Error ? error.message : '팬트리를 불러오지 못했어요.'}
        items={[]}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return <IngredientFormMock itemId={itemId} items={data ?? []} mode="edit" />;
}

function PantryContent({ cardVariant }: { cardVariant: PantryCardVariant }) {
  const { data, error, isPending, refetch } = usePantryQuery();

  if (isPending) return <PantryPage cardVariant={cardVariant} isLoading items={[]} />;
  if (error) {
    return (
      <PantryPage
        cardVariant={cardVariant}
        errorMessage={error.message}
        items={[]}
        onRetry={() => void refetch()}
      />
    );
  }

  return <PantryPage cardVariant={cardVariant} items={data ?? []} />;
}

export function PantryFlowPage({ itemId, state, view }: PantryFlowPageProps) {
  const mockState = getPantryMockState(state);
  const cardVariant = getPantryCardVariant(view);

  if (mockState === 'empty') return <PantryPage items={[]} />;
  if (mockState === 'register') return <IngredientFormMock mode="register" />;
  if (mockState === 'edit') return <EditIngredientForm itemId={itemId} />;

  if (mockState === 'loading') return <PantryPage cardVariant={cardVariant} isLoading />;

  return (
    <>
      <PantryContent cardVariant={cardVariant} />
      {mockState === 'delivery-complete' && <DeliveryCompleteDialog />}
      {mockState === 'delete-confirm' && <DeleteConfirmSheet />}
    </>
  );
}
