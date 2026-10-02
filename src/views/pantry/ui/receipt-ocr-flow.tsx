'use client';

import { ArrowLeft, Camera, Info, ImagePlus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { usePantryMutations } from '@/entities/pantry/api/use-pantry-mutations';
import { toCreatePantryItemRequest } from '@/entities/pantry/api/pantry-request';
import { uploadPantryImage } from '@/entities/pantry/api/upload-pantry-image';
import { ReceiptOcrError, type ReceiptOcrResult } from '@/entities/pantry/api/recognize-receipt';
import {
  areReceiptReviewItemsSubmittable,
  createReceiptReviewItem,
  type ReceiptReviewItem,
} from '@/entities/pantry/model/receipt-review';
import { getReceiptImageValidationError } from '@/entities/pantry/model/receipt-image';
import type { PantryStorageType } from '@/entities/pantry/model/types';

type ReceiptOcrFlowState =
  | { file: File; kind: 'loading'; previewUrl: string }
  | { error: ReceiptOcrError; file: File; kind: 'error'; previewUrl: string }
  | { file: File; kind: 'result'; previewUrl: string; result: ReceiptOcrResult };

interface ReceiptOcrFlowProps {
  onClose: () => void;
  onFileSelected: (file: File, previewUrl: string) => void;
  onManualEntry: () => void;
  onRetry: () => void;
  state: ReceiptOcrFlowState;
}

const receiptAccept = 'image/jpeg,image/png,image/webp,image/heic,.heic';
const storageOptions: Array<{ label: string; value: PantryStorageType }> = [
  { label: '냉장', value: 'REFRIGERATED' },
  { label: '냉동', value: 'FROZEN' },
  { label: '실온', value: 'ROOM_TEMP' },
];
const receiptStorageIcons: Record<
  PantryStorageType,
  { height: number; src: string; width: number }
> = {
  FROZEN: { height: 16, src: '/icons/pantry/receipt-frozen.svg', width: 14 },
  REFRIGERATED: { height: 15, src: '/icons/pantry/receipt-refrigerated.svg', width: 11 },
  ROOM_TEMP: { height: 16, src: '/icons/pantry/receipt-room-temperature.svg', width: 16 },
};

export function createReceiptReviewItemsFromOcr(result: ReceiptOcrResult): ReceiptReviewItem[] {
  return result.items.map((item, index) => ({
    ...createReceiptReviewItem(
      `${result.receiptId}-${index}`,
      item.name,
      result.purchasedAt ?? undefined,
    ),
  }));
}

type ReceiptDateField = 'expirationDate' | 'consumptionDate';

function getCalendarSelection(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  const selectedDate = year && month && day ? new Date(year, month - 1, day) : new Date();

  return {
    selectedDay: selectedDate.getDate(),
    visibleMonth: { monthIndex: selectedDate.getMonth(), year: selectedDate.getFullYear() },
  };
}

function getCalendarMonthCells(year: number, monthIndex: number) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
}

function formatCalendarDate(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function ReceiptOcrFlow({
  onClose,
  onFileSelected,
  onManualEntry,
  onRetry,
  state,
}: ReceiptOcrFlowProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    const validationError = getReceiptImageValidationError(file);
    if (validationError) {
      setInputError(validationError);
      return;
    }

    setInputError(null);
    onFileSelected(file, URL.createObjectURL(file));
  }

  return (
    <main className="mobile-page bg-background relative flex min-h-dvh flex-col pb-24">
      <header className="flex h-16 items-center border-b border-[var(--primitive-grey-100)] px-2">
        <button
          aria-label={editingItemId ? 'OCR 결과로 돌아가기' : '팬트리로 돌아가기'}
          className="grid size-10 place-items-center"
          onClick={() => (editingItemId ? setEditingItemId(null) : onClose())}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="size-6" />
        </button>
        <h1 className="text-title-3 flex-1 pr-10 text-center font-semibold">
          {state.kind === 'result' ? '식재료 등록' : '영수증 등록'}
        </h1>
      </header>

      <input
        accept={receiptAccept}
        aria-label="다른 영수증 사진 선택"
        className="sr-only"
        onChange={handleImageChange}
        ref={imageInputRef}
        type="file"
      />

      <div
        className={
          state.kind === 'result' && editingItemId
            ? 'flex flex-1 flex-col'
            : 'flex flex-1 flex-col px-4 pt-5'
        }
      >
        {state.kind !== 'result' && (
          <section className="bg-surface-secondary relative grid h-48 place-items-center overflow-hidden rounded-2xl">
            <Image
              alt="선택한 영수증 미리보기"
              className="object-contain"
              fill
              sizes="(max-width: 390px) 100vw, 390px"
              src={state.previewUrl}
              unoptimized
            />
          </section>
        )}

        {state.kind === 'loading' ? (
          <section
            aria-live="polite"
            className="flex flex-1 flex-col items-center justify-center text-center"
            role="status"
          >
            <span className="border-primary mt-8 size-10 animate-spin rounded-full border-4 border-r-transparent" />
            <h2 className="text-title-3 mt-5 font-semibold">영수증을 확인하고 있어요</h2>
            <p className="text-body-4 text-muted-foreground mt-2">
              품목을 읽는 중이에요. 잠시만 기다려 주세요.
            </p>
            <button
              className="text-muted-foreground mt-6 h-10 px-4 text-sm"
              onClick={onClose}
              type="button"
            >
              취소
            </button>
          </section>
        ) : state.kind === 'error' ? (
          <section
            aria-live="polite"
            className="flex flex-1 flex-col items-center justify-center text-center"
            role="alert"
          >
            <h2 className="text-title-3 font-semibold">
              {state.error.code === 'LLM_UNAVAILABLE'
                ? '잠시 후 다시 시도해 주세요'
                : '영수증을 확인하지 못했어요'}
            </h2>
            <p className="text-body-4 text-muted-foreground mt-2">{state.error.message}</p>
            {inputError ? (
              <p className="text-destructive text-body-4 mt-2" role="alert">
                {inputError}
              </p>
            ) : null}
            <div className="mt-6 flex w-full gap-2">
              <button
                className="bg-surface-secondary text-title-4 h-12 flex-1 rounded-full font-semibold"
                onClick={onManualEntry}
                type="button"
              >
                직접 입력
              </button>
              <button
                className="bg-primary text-title-4 h-12 flex-1 rounded-full font-semibold"
                onClick={() => imageInputRef.current?.click()}
                type="button"
              >
                사진 다시 선택
              </button>
            </div>
            <button
              className="text-muted-foreground mt-2 h-10 px-4 text-sm"
              onClick={onRetry}
              type="button"
            >
              같은 사진으로 재시도
            </button>
          </section>
        ) : (
          <ReceiptOcrReview
            onClose={onClose}
            editingItemId={editingItemId}
            onEditingItemChange={setEditingItemId}
            result={state.result}
          />
        )}
      </div>
    </main>
  );
}

interface ReceiptIngredientEditorProps {
  canComplete: boolean;
  isSaving: boolean;
  item: ReceiptReviewItem;
  onChange: (patch: Partial<ReceiptReviewItem>) => void;
  onComplete: () => void;
  onImageSelected: (file: File) => void;
}

export function ReceiptIngredientEditor({
  canComplete,
  isSaving,
  item,
  onChange,
  onComplete,
  onImageSelected,
}: ReceiptIngredientEditorProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const calendarDialogRef = useRef<HTMLElement>(null);
  const calendarTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerError, setImagePickerError] = useState<string | null>(null);
  const [activeDateField, setActiveDateField] = useState<ReceiptDateField | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => getCalendarSelection('').visibleMonth);
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());

  function selectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    const validationError = getReceiptImageValidationError(file);
    if (
      validationError ||
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setImagePickerError('JPEG, PNG, WebP 형식의 5MB 이하 이미지를 선택해주세요.');
      return;
    }

    setImagePickerError(null);
    onImageSelected(file);
    setIsImagePickerOpen(false);
  }

  const dateFields = [
    {
      field: 'expirationDate',
      label: '유통기한',
    },
    {
      field: 'consumptionDate',
      label: '소비기한',
    },
  ] as const;

  function openDatePicker(field: ReceiptDateField, date: string, trigger: HTMLButtonElement) {
    const selection = getCalendarSelection(date);
    calendarTriggerRef.current = trigger;
    setVisibleMonth(selection.visibleMonth);
    setSelectedDay(selection.selectedDay);
    setActiveDateField(field);
  }

  function closeDatePicker() {
    setActiveDateField(null);
    calendarTriggerRef.current?.focus();
  }

  function moveCalendarMonth(offset: number) {
    const nextMonth = new Date(visibleMonth.year, visibleMonth.monthIndex + offset, 1);
    setVisibleMonth({ year: nextMonth.getFullYear(), monthIndex: nextMonth.getMonth() });
    setSelectedDay(1);
  }

  useEffect(() => {
    if (!activeDateField) return;

    const dialog = calendarDialogRef.current;
    const focusableElements = dialog
      ? Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled])'))
      : [];
    dialog?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveDateField(null);
        calendarTriggerRef.current?.focus();
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
        firstElement?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDateField]);

  return (
    <section className="flex flex-1 flex-col">
      <input
        accept="image/jpeg,image/png,image/webp"
        aria-label="카메라로 식재료 이미지 선택"
        className="sr-only"
        onChange={selectImage}
        ref={cameraInputRef}
        type="file"
        capture="environment"
      />
      <input
        accept="image/jpeg,image/png,image/webp"
        aria-label="앨범에서 식재료 이미지 선택"
        className="sr-only"
        onChange={selectImage}
        ref={galleryInputRef}
        type="file"
      />

      <form
        className="mx-4 mt-11 w-[calc(100%_-_32px)]"
        onSubmit={(event) => {
          event.preventDefault();
          if (canComplete && !isSaving) onComplete();
        }}
      >
        <div className="grid grid-cols-[80px_minmax(0,1fr)] items-start gap-3">
          <button
            aria-label="식재료 이미지 직접 등록"
            className="bg-surface-secondary border-border relative grid size-20 place-items-center overflow-hidden rounded-sm border"
            disabled={isSaving}
            onClick={() => setIsImagePickerOpen(true)}
            type="button"
          >
            {item.imagePreviewUrl ? (
              <Image
                alt="선택한 식재료 이미지 미리보기"
                className="object-cover"
                fill
                sizes="80px"
                src={item.imagePreviewUrl}
                unoptimized
              />
            ) : (
              <Image
                alt=""
                aria-hidden="true"
                height={24}
                src="/icons/pantry/camera.svg"
                unoptimized
                width={24}
              />
            )}
          </button>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-title-4 flex items-start gap-1.5 font-medium"
              htmlFor="receipt-edit-name"
            >
              식재료명
              <span aria-hidden="true" className="text-destructive text-sm leading-[14px]">
                *
              </span>
            </label>
            <span className="relative">
              <input
                autoFocus
                className={`text-title-4 focus-visible:ring-ring placeholder:text-disabled h-12 w-full rounded-xl border px-4 pr-14 font-normal outline-none focus-visible:ring-2 ${item.name.trim() ? 'pantry-field-complete border-border-complete bg-surface-complete' : 'border-border bg-surface-secondary'}`}
                disabled={isSaving}
                id="receipt-edit-name"
                maxLength={20}
                onChange={(event) => onChange({ name: event.target.value })}
                placeholder="식재료명을 입력해주세요"
                value={item.name}
              />
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm leading-[21px] [color:var(--text-disabled)]">
                {item.name.length}/20
              </span>
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {dateFields.map(({ field, label }) => (
            <div className="flex flex-col gap-1" key={field}>
              <p className="text-title-4 font-medium">{label}</p>
              <div className="relative">
                <button
                  aria-label={`${label} 선택`}
                  className={`text-title-4 focus-visible:ring-ring flex h-12 w-full items-center rounded-xl border px-1.5 text-left font-normal outline-none focus-visible:ring-2 ${item[field] ? 'pantry-field-complete border-border-complete bg-surface-complete' : 'border-border bg-surface-secondary'}`}
                  disabled={isSaving}
                  onClick={(event) => openDatePicker(field, item[field], event.currentTarget)}
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
                  <span className={item[field] ? '' : 'text-disabled'}>
                    {item[field] || 'YYYY-MM-DD'}
                  </span>
                </button>
              </div>
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
              {[
                { icon: '/icons/pantry/refrigerated.svg', label: '냉장', value: 'REFRIGERATED' },
                { icon: '/icons/pantry/frozen.svg', label: '냉동', value: 'FROZEN' },
                { icon: '/icons/pantry/room-temperature.svg', label: '실온', value: 'ROOM_TEMP' },
              ].map(({ icon, label, value }) => {
                const selected = item.storageType === value;

                return (
                  <button
                    aria-pressed={selected}
                    className={
                      selected
                        ? 'bg-surface-complete border-border-complete text-title-4 flex h-12 items-center justify-center gap-1.5 rounded-lg border font-medium'
                        : 'bg-surface-secondary border-border text-disabled text-title-4 flex h-12 items-center justify-center gap-1.5 rounded-lg border font-medium'
                    }
                    disabled={isSaving}
                    key={value}
                    onClick={() => onChange({ storageType: value as PantryStorageType })}
                    type="button"
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={16}
                      src={icon}
                      unoptimized
                      width={16}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <Button
          className="text-title-3 mt-[76px] h-[60px] w-full rounded-xl font-semibold"
          disabled={!canComplete || isSaving}
          type="submit"
        >
          {isSaving ? '등록 중...' : '등록하기'}
        </Button>
      </form>

      {activeDateField ? (
        <div
          className="fixed inset-0 z-20 overflow-hidden"
          onClick={closeDatePicker}
          role="presentation"
        >
          <section
            aria-labelledby="receipt-calendar-title"
            aria-modal="true"
            className="bg-background fixed bottom-0 left-1/2 h-[562px] w-full max-w-[390px] -translate-x-1/2 rounded-t-[20px] outline-none"
            onClick={(event) => event.stopPropagation()}
            ref={calendarDialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="absolute top-6 right-5 left-5 flex h-10 items-center justify-between">
              <h2 className="text-title-3 font-semibold" id="receipt-calendar-title">
                {activeDateField === 'expirationDate' ? '유통기한' : '소비기한'} 날짜 선택
              </h2>
              <button
                aria-label="날짜 선택 닫기"
                className="grid size-10 place-items-center"
                onClick={closeDatePicker}
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
              {getCalendarMonthCells(visibleMonth.year, visibleMonth.monthIndex).map(
                (day, index) =>
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
                onChange({
                  [activeDateField]: formatCalendarDate(
                    visibleMonth.year,
                    visibleMonth.monthIndex,
                    selectedDay,
                  ),
                });
                closeDatePicker();
              }}
              type="button"
            >
              선택 완료
            </Button>
          </section>
        </div>
      ) : null}

      {isImagePickerOpen ? (
        <div
          className="bg-overlay/40 fixed inset-0 z-20 flex items-end"
          onClick={() => setIsImagePickerOpen(false)}
          role="presentation"
        >
          <section
            aria-labelledby="receipt-image-picker-title"
            aria-modal="true"
            className="bg-card w-full rounded-t-3xl px-4 pt-3 pb-8"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="bg-surface-disabled mx-auto h-1.5 w-12 rounded-full" />
            <h2 className="text-title-3 mt-6 font-semibold" id="receipt-image-picker-title">
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
            {imagePickerError ? (
              <p className="text-destructive mt-3 text-sm" role="alert">
                {imagePickerError}
              </p>
            ) : null}
            <button
              className="text-disabled mt-4 h-10 w-full text-sm font-medium"
              onClick={() => setIsImagePickerOpen(false)}
              type="button"
            >
              취소
            </button>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function ReceiptOcrReview({
  onClose,
  editingItemId,
  onEditingItemChange,
  result,
}: {
  onClose: () => void;
  editingItemId: string | null;
  onEditingItemChange: (itemId: string | null) => void;
  result: ReceiptOcrResult;
}) {
  const { create } = usePantryMutations();
  const [items, setItems] = useState(() => createReceiptReviewItemsFromOcr(result));
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const previewUrlsRef = useRef(new Set<string>());

  useEffect(
    () => () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    },
    [],
  );

  function updateItem(id: string, patch: Partial<ReceiptReviewItem>) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    const item = createReceiptReviewItem(crypto.randomUUID(), '');
    setItems((currentItems) => [...currentItems, item]);
    onEditingItemChange(item.id);
  }

  function removeItem(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  async function saveItems() {
    if (!areReceiptReviewItemsSubmittable(items)) return;

    const submittedItems = items;
    setIsSaving(true);
    setSaveError(null);

    const results = await Promise.allSettled(
      submittedItems.map((item) =>
        (async () => {
          const imageUrl = item.imageFile ? (await uploadPantryImage(item.imageFile)).imageUrl : '';
          return create.mutateAsync(
            toCreatePantryItemRequest({
              consumptionDate: item.consumptionDate,
              expirationDate: item.expirationDate,
              imageUrl,
              name: item.name,
              purchaseDate: item.purchaseDate,
              storageType: item.storageType as PantryStorageType,
            }),
          );
        })(),
      ),
    );
    const failedItems = submittedItems.filter((_, index) => results[index]?.status === 'rejected');
    const savedCount = submittedItems.length - failedItems.length;

    if (failedItems.length === 0) {
      onClose();
      setIsSaving(false);
      return;
    }

    setItems(failedItems);
    setSaveError(
      savedCount > 0
        ? `${savedCount}개는 등록했고, ${failedItems.length}개는 등록하지 못했어요. 실패한 항목만 다시 확인해 주세요.`
        : '식재료를 등록하지 못했어요. 입력값을 확인한 뒤 다시 시도해 주세요.',
    );
    setIsSaving(false);
  }

  const canSave = areReceiptReviewItemsSubmittable(items);
  const editingItem = items.find((item) => item.id === editingItemId);

  function closeItemEditor() {
    onEditingItemChange(null);
  }

  function selectItemImage(file: File) {
    if (!editingItem) return;
    if (editingItem.imagePreviewUrl) {
      URL.revokeObjectURL(editingItem.imagePreviewUrl);
      previewUrlsRef.current.delete(editingItem.imagePreviewUrl);
    }
    const imagePreviewUrl = URL.createObjectURL(file);
    previewUrlsRef.current.add(imagePreviewUrl);
    updateItem(editingItem.id, { imageFile: file, imagePreviewUrl });
    setSaveError(null);
  }

  return (
    <section className="flex flex-1 flex-col">
      {editingItem ? (
        <ReceiptIngredientEditor
          canComplete={Boolean(editingItem.name.trim() && editingItem.storageType)}
          isSaving={isSaving}
          item={editingItem}
          onChange={(patch) => updateItem(editingItem.id, patch)}
          onComplete={closeItemEditor}
          onImageSelected={selectItemImage}
        />
      ) : (
        <>
          <div className="bg-surface-complete flex items-center rounded-xl py-3 pr-5 pl-4">
            <div className="flex shrink-0 items-center gap-2">
              <div
                aria-hidden="true"
                className="relative h-[35px] w-[30px] shrink-0 overflow-hidden"
              >
                <Image
                  alt=""
                  className="absolute top-[-38.1%] left-[-97.22%] h-[171.43%] w-[300%] max-w-none"
                  height={1024}
                  src="/images/pantry/receipt-recognized-banner.png"
                  unoptimized
                  width={1536}
                />
              </div>
              <div className="flex shrink-0 flex-col leading-[1.5] whitespace-nowrap">
                <h2 className="text-label-3 font-semibold">영수증에서 식재료를 인식했어요</h2>
                <p className="text-text-secondary text-xs font-medium">
                  정보를 확인하고 필요한 내용은 수정해 주세요
                </p>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-surface-secondary text-body-4 text-muted-foreground mt-5 rounded-xl p-4">
              인식된 식재료가 없어요. 직접 항목을 추가해 주세요.
            </div>
          ) : null}

          <div className="mt-5 flex flex-col">
            {items.map((item, index) => (
              <section
                aria-label={`식재료 ${index + 1}: ${item.name || '이름 없음'}`}
                className="border-border flex items-end gap-2.5 border-b-[1.5px] pb-5"
                key={item.id}
              >
                <div className="bg-surface-secondary relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    alt={item.imagePreviewUrl ? `${item.name} 이미지` : ''}
                    aria-hidden={!item.imagePreviewUrl}
                    className="object-cover"
                    fill
                    sizes="80px"
                    src={item.imagePreviewUrl || '/images/pantry/pantry-basic.svg'}
                    unoptimized
                  />
                </div>
                <div className="flex min-w-0 flex-1 self-stretch">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="mb-[-2px] flex w-full items-center justify-between">
                      <div className="mr-[-4px] flex min-w-0 flex-1 items-center">
                        <p className="text-text-secondary max-w-[calc(100%-34px)] min-w-0 overflow-hidden text-[15px] leading-[1.5] font-medium text-ellipsis whitespace-nowrap">
                          {item.name || '식재료명을 입력해 주세요'}
                        </p>
                        <button
                          aria-label={`${item.name || `식재료 ${index + 1}`} 정보 수정`}
                          className="flex h-9 shrink-0 items-center justify-center px-2 py-1"
                          disabled={isSaving}
                          onClick={() => onEditingItemChange(item.id)}
                          type="button"
                        >
                          <Image
                            alt=""
                            aria-hidden="true"
                            height={18}
                            src="/icons/pantry/receipt-edit.svg"
                            unoptimized
                            width={18}
                          />
                        </button>
                      </div>
                      <button
                        aria-label={`${item.name || `식재료 ${index + 1}`} 삭제`}
                        className="flex size-8 shrink-0 items-start justify-end pb-2 pl-2"
                        disabled={isSaving}
                        onClick={() => removeItem(item.id)}
                        type="button"
                      >
                        <Image
                          alt=""
                          aria-hidden="true"
                          height={24}
                          src="/icons/pantry/receipt-delete.svg"
                          unoptimized
                          width={24}
                        />
                      </button>
                    </div>
                    <fieldset className="flex flex-col gap-0.5">
                      <legend className="text-text-tertiary text-label-4 flex items-center gap-0.5 font-medium">
                        보관방법
                        <Image
                          alt="필수"
                          height={12}
                          src="/icons/pantry/receipt-required.svg"
                          unoptimized
                          width={6}
                        />
                      </legend>
                      <div className="flex h-8 w-full items-center gap-2">
                        {storageOptions.map((option) => {
                          const icon = receiptStorageIcons[option.value];
                          const selected = item.storageType === option.value;

                          return (
                            <button
                              aria-pressed={selected}
                              className={`text-label-4 flex h-8 w-[84px] shrink-0 items-center justify-center gap-1.5 rounded-sm border font-medium ${selected ? 'bg-surface-complete border-border-complete text-text-secondary' : 'bg-surface-secondary border-border text-text-tertiary'}`}
                              disabled={isSaving}
                              key={option.value}
                              onClick={() => updateItem(item.id, { storageType: option.value })}
                              type="button"
                            >
                              <Image
                                alt=""
                                aria-hidden="true"
                                height={icon.height}
                                src={icon.src}
                                unoptimized
                                width={icon.width}
                              />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <button
            className="border-border text-title-4 mt-4 flex h-12 items-center justify-center gap-2 rounded-xl border font-medium"
            disabled={isSaving}
            onClick={addItem}
            type="button"
          >
            <Plus aria-hidden="true" className="size-5" />
            재료 추가
          </button>

          {saveError ? (
            <p aria-live="polite" className="text-destructive text-body-4 mt-3" role="alert">
              {saveError}
            </p>
          ) : null}

          <button
            className="bg-primary text-title-4 mt-4 mb-5 h-[60px] rounded-xl font-semibold disabled:opacity-50"
            disabled={!canSave || isSaving}
            onClick={() => void saveItems()}
            type="button"
          >
            {isSaving ? '등록 중...' : '팬트리에 등록'}
          </button>
        </>
      )}
    </section>
  );
}
