'use client';

/** 팬트리 조회와 등록·수정·목업 화면 흐름을 조합함 */

import { Camera, CheckCircle2, ChevronLeft, ImagePlus, Info, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { usePantryMutations } from '@/entities/pantry/api/use-pantry-mutations';
import {
  toCreatePantryItemRequest,
  toUpdatePantryItemRequest,
} from '@/entities/pantry/api/pantry-request';
import { usePantryStore } from '@/entities/pantry/model/pantry-store';
import { getPantryCardVariant } from '@/entities/pantry/model/types';
import type {
  PantryCardVariant,
  PantryItem,
  PantryStorageType,
} from '@/entities/pantry/model/types';
import { usePantryQuery } from '@/views/pantry/model/use-pantry-query';
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

export function getPantryImageInputProps(source: 'camera' | 'gallery') {
  return source === 'camera'
    ? { accept: 'image/*', capture: 'environment' as const }
    : { accept: 'image/*' };
}

type IngredientDateField = 'expiration' | 'consumption';

interface IngredientDraft {
  consumptionDate: string;
  expirationDate: string;
  id: string;
  imageUrl: string;
  name: string;
  storageType: PantryStorageType | null;
}

function createIngredientDraft(id: string, item?: PantryItem): IngredientDraft {
  return {
    consumptionDate: item?.consumptionDate ?? '',
    expirationDate: item?.expirationDate ?? '',
    id,
    imageUrl: item?.imageUrl ?? '',
    name: item?.name ?? '',
    storageType: item?.storageType ?? null,
  };
}

export function areIngredientFormsSubmittable(
  ingredients: Array<Pick<IngredientDraft, 'name' | 'storageType'>>,
) {
  return (
    ingredients.length > 0 &&
    ingredients.every(({ name, storageType }) => isIngredientFormSubmittable(name, storageType))
  );
}

interface IngredientFieldsProps {
  ingredient: IngredientDraft;
  index: number;
  onOpenCalendar: (
    ingredientId: string,
    field: IngredientDateField,
    date: string,
    trigger: HTMLButtonElement,
  ) => void;
  onOpenImagePicker: (ingredientId: string) => void;
  onRemove: (ingredientId: string) => void;
  onUpdate: (ingredientId: string, patch: Partial<IngredientDraft>) => void;
}

function IngredientFields({
  ingredient,
  index,
  onOpenCalendar,
  onOpenImagePicker,
  onRemove,
  onUpdate,
}: IngredientFieldsProps) {
  const inputId = `pantry-ingredient-name-${ingredient.id}`;

  return (
    <section
      aria-labelledby={`${inputId}-label`}
      className={index === 0 ? '' : 'border-border mt-8 border-t pt-8'}
    >
      <div className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-3">
        <button
          aria-label={`${index + 1}번째 식재료 이미지 추가`}
          className="bg-surface-secondary border-border relative grid size-20 overflow-hidden rounded-sm border"
          onClick={() => onOpenImagePicker(ingredient.id)}
          type="button"
        >
          {ingredient.imageUrl ? (
            <Image
              alt="선택한 식재료 이미지"
              className="object-cover"
              fill
              sizes="80px"
              src={ingredient.imageUrl}
              unoptimized={ingredient.imageUrl.startsWith('blob:')}
            />
          ) : (
            <Image
              alt=""
              aria-hidden="true"
              className="absolute inset-0 m-auto"
              height={24}
              src="/icons/pantry/camera.svg"
              unoptimized
              width={24}
            />
          )}
        </button>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <label
              className="text-title-4 flex items-start gap-1.5 font-medium"
              htmlFor={inputId}
              id={`${inputId}-label`}
            >
              식재료명
              <span aria-hidden="true" className="text-destructive text-sm leading-[14px]">
                *
              </span>
            </label>
            {index > 0 ? (
              <button
                aria-label={`${index + 1}번째 재료 삭제`}
                className="text-disabled -mt-2 -mr-2 grid size-8 place-items-center"
                onClick={() => onRemove(ingredient.id)}
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            ) : null}
          </div>
          <span className="relative">
            <input
              className="bg-surface-secondary text-title-4 focus-visible:ring-ring placeholder:text-disabled h-12 w-full rounded-xl border px-4 pr-14 font-normal outline-none focus-visible:ring-2"
              id={inputId}
              maxLength={20}
              name="ingredientName"
              onChange={(event) => onUpdate(ingredient.id, { name: event.target.value })}
              placeholder="식재료명을 입력해주세요"
              value={ingredient.name}
            />
            <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm leading-[21px] [color:var(--text-disabled)]">
              {ingredient.name.length}/20
            </span>
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {(
          [
            ['유통기한', 'expiration', ingredient.expirationDate],
            ['소비기한', 'consumption', ingredient.consumptionDate],
          ] as const
        ).map(([label, field, date]) => (
          <div className="flex flex-col gap-1" key={field}>
            <p className="text-title-4 font-medium">{label}</p>
            <button
              aria-label={`${label} 선택`}
              className="bg-surface-secondary text-title-4 focus-visible:ring-ring flex h-12 w-full items-center rounded-xl border px-1.5 text-left font-normal outline-none focus-visible:ring-2"
              onClick={(event) => onOpenCalendar(ingredient.id, field, date, event.currentTarget)}
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
              <span className={date ? '' : 'text-disabled'}>{date || 'YYYY-MM-DD'}</span>
            </button>
            <p className="text-disabled flex items-center gap-1 text-xs leading-[18px]">
              <Info aria-hidden="true" className="size-4" />
              식재료에 표기된 날짜 유형을 선택해주세요
            </p>
          </div>
        ))}

        <fieldset>
          <legend className="text-title-4 flex items-start gap-1.5 font-medium">
            보관방법
            <span aria-hidden="true" className="text-destructive text-sm leading-[14px]">
              *
            </span>
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                ['냉장', 'REFRIGERATED', '/icons/pantry/refrigerated.svg', 'h-[15px] w-[11px]'],
                ['냉동', 'FROZEN', '/icons/pantry/frozen.svg', 'h-4 w-[14px]'],
                ['실온', 'ROOM_TEMP', '/icons/pantry/room-temperature.svg', 'size-4'],
              ] as const
            ).map(([label, storageType, iconSrc, iconClassName]) => (
              <button
                aria-pressed={ingredient.storageType === storageType}
                className={
                  ingredient.storageType === storageType
                    ? 'bg-primary/15 border-primary text-title-4 flex h-12 items-center justify-center gap-1.5 rounded-lg border font-medium'
                    : 'bg-surface-secondary text-disabled text-title-4 flex h-12 items-center justify-center gap-1.5 rounded-lg border font-medium'
                }
                key={storageType}
                onClick={() => onUpdate(ingredient.id, { storageType })}
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
    </section>
  );
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
  const storedItems = usePantryStore((state) => state.items);
  const { create, update } = usePantryMutations();
  const currentItems = items ?? storedItems;
  const editingItem = mode === 'edit' ? currentItems.find((item) => item.id === itemId) : undefined;
  const initialIngredient = createIngredientDraft(editingItem?.id ?? 'ingredient-1', editingItem);
  const [ingredients, setIngredients] = useState<IngredientDraft[]>([initialIngredient]);
  const [activeDateField, setActiveDateField] = useState<{
    field: IngredientDateField;
    ingredientId: string;
  }>({ field: 'expiration', ingredientId: initialIngredient.id });
  const initialCalendarSelection = getCalendarSelection('');
  const [visibleMonth, setVisibleMonth] = useState(initialCalendarSelection.visibleMonth);
  const [selectedDay, setSelectedDay] = useState(initialCalendarSelection.selectedDay);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [activeImageIngredientId, setActiveImageIngredientId] = useState(initialIngredient.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const calendarDialogRef = useRef<HTMLElement>(null);
  const calendarTriggerRef = useRef<HTMLButtonElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const isEdit = mode === 'edit';
  const primaryIngredient = ingredients[0];
  const ingredientName = primaryIngredient.name;
  const storageType = primaryIngredient.storageType;
  const expirationDate = primaryIngredient.expirationDate;
  const consumptionDate = primaryIngredient.consumptionDate;
  const imageUrl = primaryIngredient.imageUrl;
  const canSubmit = areIngredientFormsSubmittable(ingredients) && (!isEdit || Boolean(editingItem));
  const isSubmitting = create.isPending || update.isPending;
  const calendarCells = getCalendarMonthCells(visibleMonth.year, visibleMonth.monthIndex);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || (isEdit && !editingItem)) return;

    const requests = ingredients.map((ingredient) => ({
      ...ingredient,
      storageType: ingredient.storageType ?? 'REFRIGERATED',
    }));

    setSubmitError(null);

    try {
      if (isEdit && editingItem) {
        await update.mutateAsync({
          pantryItemId: editingItem.id,
          payload: toUpdatePantryItemRequest(requests[0]),
        });
      } else {
        await Promise.all(
          requests.map((ingredient) => create.mutateAsync(toCreatePantryItemRequest(ingredient))),
        );
      }

      router.push('/pantry');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '식재료 등록에 실패했어요.');
    }
  }

  function openCalendar(
    ingredientId: string,
    field: IngredientDateField,
    date: string,
    trigger: HTMLButtonElement,
  ) {
    const selection = getCalendarSelection(date);
    calendarTriggerRef.current = trigger;
    setActiveDateField({ field, ingredientId });
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

  function selectIngredientImage(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.currentTarget.files?.[0];
    if (!image) return;

    updateIngredient(activeImageIngredientId, { imageUrl: URL.createObjectURL(image) });
    setIsImagePickerOpen(false);
    event.currentTarget.value = '';
  }

  function updateIngredient(ingredientId: string, patch: Partial<IngredientDraft>) {
    setIngredients((currentIngredients) =>
      currentIngredients.map((ingredient) =>
        ingredient.id === ingredientId ? { ...ingredient, ...patch } : ingredient,
      ),
    );
  }

  function updatePrimaryIngredient(patch: Partial<IngredientDraft>) {
    updateIngredient(primaryIngredient.id, patch);
  }

  function addIngredient() {
    const nextIngredient = createIngredientDraft(`ingredient-${Date.now()}`);
    setIngredients((currentIngredients) => [...currentIngredients, nextIngredient]);
  }

  function removeIngredient(ingredientId: string) {
    setIngredients((currentIngredients) =>
      currentIngredients.filter((ingredient) => ingredient.id !== ingredientId),
    );
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
      <header className="relative flex h-16 w-full items-center">
        <Link
          aria-label="이전 페이지"
          className="grid size-10 shrink-0 place-items-center"
          href="/pantry"
        >
          <ChevronLeft aria-hidden="true" className="size-6" />
        </Link>
        <h1 className="text-title-3 absolute left-1/2 -translate-x-1/2 font-semibold">
          {isEdit ? '식재료 수정' : '식재료 등록'}
        </h1>
      </header>

      <form className="mx-4 mt-11 w-[calc(100%_-_32px)]" onSubmit={handleSubmit}>
        <div className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-3">
          <button
            aria-label="식재료 이미지 추가"
            className="bg-surface-secondary border-border relative grid size-20 overflow-hidden rounded-sm border"
            onClick={() => {
              setActiveImageIngredientId(primaryIngredient.id);
              setIsImagePickerOpen(true);
            }}
            type="button"
          >
            {imageUrl ? (
              <Image
                alt="선택한 식재료 이미지"
                className="object-cover"
                fill
                sizes="80px"
                src={imageUrl}
                unoptimized={imageUrl.startsWith('blob:')}
              />
            ) : (
              <Image
                alt=""
                aria-hidden="true"
                className="absolute inset-0 m-auto"
                height={24}
                src="/icons/pantry/camera.svg"
                unoptimized
                width={24}
              />
            )}
          </button>
          <input
            {...getPantryImageInputProps('camera')}
            className="sr-only"
            onChange={selectIngredientImage}
            ref={cameraInputRef}
            type="file"
          />
          <input
            {...getPantryImageInputProps('gallery')}
            className="sr-only"
            onChange={selectIngredientImage}
            ref={galleryInputRef}
            type="file"
          />

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
                className="bg-surface-secondary text-title-4 focus-visible:ring-ring placeholder:text-disabled h-12 w-full rounded-xl border px-4 pr-14 font-normal outline-none focus-visible:ring-2"
                id="pantry-ingredient-name"
                maxLength={20}
                name="ingredientName"
                onChange={(event) => updatePrimaryIngredient({ name: event.target.value })}
                placeholder="식재료명을 입력해주세요"
                value={ingredientName}
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm leading-[21px] [color:var(--text-disabled)]">
                {ingredientName.length}/20
              </span>
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-title-4 font-medium">유통기한</p>
            <button
              aria-label="유통기한 선택"
              className="bg-surface-secondary text-title-4 focus-visible:ring-ring flex h-12 w-full items-center rounded-xl border px-1.5 text-left font-normal outline-none focus-visible:ring-2"
              onClick={(event) => {
                openCalendar(
                  primaryIngredient.id,
                  'expiration',
                  expirationDate,
                  event.currentTarget,
                );
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
                {expirationDate || 'YYYY-MM-DD'}
              </span>
            </button>
            <p className="text-disabled flex items-center gap-1 text-xs leading-[18px]">
              <Info aria-hidden="true" className="size-4" />
              식재료에 표기된 날짜 유형을 선택해주세요
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-title-4 font-medium">소비기한</p>
            <button
              aria-label="소비기한 선택"
              className="bg-surface-secondary text-title-4 focus-visible:ring-ring flex h-12 w-full items-center rounded-xl border px-1.5 text-left font-normal outline-none focus-visible:ring-2"
              onClick={(event) => {
                openCalendar(
                  primaryIngredient.id,
                  'consumption',
                  consumptionDate,
                  event.currentTarget,
                );
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
                {consumptionDate || 'YYYY-MM-DD'}
              </span>
            </button>
            <p className="text-disabled flex items-center gap-1 text-xs leading-[18px]">
              <Info aria-hidden="true" className="size-4" />
              식재료에 표기된 날짜 유형을 선택해주세요
            </p>
          </div>

          <fieldset>
            <legend className="text-title-4 flex items-start gap-1.5 font-medium">
              보관방법
              <span aria-hidden="true" className="text-destructive text-sm leading-[14px]">
                *
              </span>
            </legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
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
                      ? 'bg-primary/15 border-primary text-title-4 flex h-12 items-center justify-center gap-1.5 rounded-lg border font-medium'
                      : 'bg-surface-secondary text-disabled text-title-4 flex h-12 items-center justify-center gap-1.5 rounded-lg border font-medium'
                  }
                  key={type}
                  onClick={() => updatePrimaryIngredient({ storageType: type })}
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

        {ingredients.slice(1).map((ingredient, index) => (
          <IngredientFields
            ingredient={ingredient}
            index={index + 1}
            key={ingredient.id}
            onOpenCalendar={openCalendar}
            onOpenImagePicker={(ingredientId) => {
              setActiveImageIngredientId(ingredientId);
              setIsImagePickerOpen(true);
            }}
            onRemove={removeIngredient}
            onUpdate={updateIngredient}
          />
        ))}

        {!isEdit ? (
          <button
            className="text-disabled mx-auto mt-20 flex flex-col items-center gap-2 text-sm leading-[21px] font-medium"
            onClick={addIngredient}
            type="button"
          >
            <span className="bg-surface-disabled grid size-[52px] place-items-center rounded-full">
              <Plus aria-hidden="true" className="size-[31px]" />
            </span>
            재료 추가
          </button>
        ) : null}

        {submitError ? (
          <p className="text-destructive mt-6 text-center text-sm" role="alert">
            {submitError}
          </p>
        ) : null}

        <Button
          className={
            canSubmit
              ? 'text-title-3 mt-[76px] h-[60px] w-full rounded-xl font-semibold'
              : 'bg-surface-disabled text-title-3 mt-[76px] h-[60px] w-full rounded-xl font-semibold [color:var(--text-disabled)] disabled:opacity-100'
          }
          disabled={!canSubmit || isSubmitting}
          type="submit"
        >
          {isSubmitting ? '등록 중...' : isEdit ? '수정하기' : '등록하기'}
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
                updateIngredient(
                  activeDateField.ingredientId,
                  activeDateField.field === 'expiration'
                    ? { expirationDate: selectedDate }
                    : { consumptionDate: selectedDate },
                );
                closeCalendar();
              }}
              type="button"
            >
              선택 완료
            </Button>
          </section>
        </div>
      )}
      {isImagePickerOpen && (
        <div
          className="bg-overlay/40 fixed inset-0 z-20 flex items-end"
          onClick={() => setIsImagePickerOpen(false)}
          role="presentation"
        >
          <section
            aria-labelledby="image-picker-title"
            aria-modal="true"
            className="bg-card w-full rounded-t-3xl px-4 pt-3 pb-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="bg-surface-disabled mx-auto h-1.5 w-12 rounded-full" />
            <h2 className="text-title-3 mt-6 font-semibold" id="image-picker-title">
              사진 등록
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                className="h-14 rounded-xl font-semibold"
                onClick={() => cameraInputRef.current?.click()}
                type="button"
                variant="outline"
              >
                <Camera aria-hidden="true" className="size-5" />
                사진 촬영
              </Button>
              <Button
                className="h-14 rounded-xl font-semibold"
                onClick={() => galleryInputRef.current?.click()}
                type="button"
                variant="outline"
              >
                <ImagePlus aria-hidden="true" className="size-5" />
                앨범에서 선택
              </Button>
            </div>
            <button
              className="text-disabled mt-4 h-10 w-full text-sm font-medium"
              onClick={() => setIsImagePickerOpen(false)}
              type="button"
            >
              취소
            </button>
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
