'use client';

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ImagePlus,
  PackageCheck,
  Plus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { getPantryCardVariant } from '@/entities/pantry/model/types';
import { PantryPage } from '@/views/pantry/ui/pantry-page';

export type PantryMockState =
  'empty' | 'full' | 'delivery-complete' | 'register' | 'edit' | 'delete-confirm';

interface PantryFlowPageProps {
  state?: string;
  view?: string;
}

export function getPantryMockState(state?: string): PantryMockState {
  if (
    state === 'empty' ||
    state === 'delivery-complete' ||
    state === 'register' ||
    state === 'edit' ||
    state === 'delete-confirm'
  ) {
    return state;
  }

  return 'full';
}

function PantryEmptyMock() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-4 pt-4 pb-10">
      <header className="flex h-12 items-center justify-between">
        <h1 className="text-title-2 font-semibold">나의 팬트리</h1>
        <Button asChild size="sm">
          <Link href="/pantry?state=register">
            <Plus aria-hidden="true" />
            식재료 추가
          </Link>
        </Button>
      </header>
      <section className="bg-card mt-24 flex min-h-80 flex-col items-center justify-center rounded-3xl border px-6 text-center">
        <PackageCheck aria-hidden="true" className="text-primary size-12" />
        <h2 className="text-title-3 mt-5 font-semibold">아직 등록된 식재료가 없어요</h2>
        <p className="text-body-4 text-muted-foreground mt-2">
          식재료를 등록하거나 배송이 완료되면
          <br />
          나의 팬트리에 자동으로 담겨요.
        </p>
        <Button asChild className="mt-6">
          <Link href="/pantry?state=register">식재료 등록하기</Link>
        </Button>
      </section>
    </main>
  );
}

function IngredientFormMock({ mode }: { mode: 'register' | 'edit' }) {
  const [storageType, setStorageType] = useState('냉장');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isEdit = mode === 'edit';

  return (
    <main className="bg-background mx-auto min-h-dvh w-full max-w-[390px] px-4 pt-4 pb-10">
      <header className="flex h-12 items-center justify-between">
        <Link
          aria-label="이전 페이지"
          className="grid size-10 place-items-center rounded-full"
          href="/pantry"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </Link>
        <h1 className="text-title-2 font-semibold">식재료 {isEdit ? '수정' : '등록'}</h1>
        <Link className="text-label-3 text-muted-foreground" href="/pantry">
          취소
        </Link>
      </header>
      <form className="mt-6 space-y-5">
        <div>
          <p className="text-label-3 font-medium">식재료 이미지</p>
          <button
            className="bg-muted text-muted-foreground mt-2 grid size-24 place-items-center rounded-xl"
            type="button"
          >
            <ImagePlus aria-hidden="true" className="size-7" />
          </button>
        </div>
        <label className="block">
          <span className="text-label-3 font-medium">식재료 이름</span>
          <input
            className="bg-card mt-2 h-12 w-full rounded-xl border px-4"
            defaultValue={isEdit ? '대파' : ''}
            name="ingredientName"
            placeholder="예: 대파"
          />
        </label>
        <label className="block">
          <span className="text-label-3 font-medium">소비기한</span>
          <button
            className="bg-card text-body-4 mt-2 flex h-12 w-full items-center justify-between rounded-xl border px-4"
            onClick={() => setIsCalendarOpen(true)}
            type="button"
          >
            <span>2026.09.01</span>
            <CalendarDays aria-hidden="true" className="text-muted-foreground size-4" />
          </button>
        </label>
        <fieldset>
          <legend className="text-label-3 font-medium">보관 방법</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {['냉장', '냉동', '실온'].map((type) => (
              <button
                className={
                  storageType === type
                    ? 'bg-primary text-primary-foreground text-label-3 rounded-xl py-3'
                    : 'bg-card text-label-3 rounded-xl border py-3'
                }
                key={type}
                onClick={() => setStorageType(type)}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block">
          <span className="text-label-3 font-medium">
            메모 <span className="text-muted-foreground font-normal">선택</span>
          </span>
          <textarea
            className="bg-card text-body-4 mt-2 min-h-24 w-full rounded-xl border p-4"
            placeholder="구입량이나 보관 위치를 적어주세요."
          />
        </label>
        <Button asChild className="h-12 w-full">
          <Link href="/pantry">{isEdit ? '수정 완료' : '등록 완료'}</Link>
        </Button>
      </form>
      {isCalendarOpen && (
        <div className="bg-overlay/40 fixed inset-0 z-20 flex items-end" role="presentation">
          <section
            aria-label="소비기한 선택"
            aria-modal="true"
            className="bg-card mx-auto w-full max-w-[390px] rounded-t-3xl p-5"
            role="dialog"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-title-3 font-semibold">소비기한 선택</h2>
              <button
                aria-label="날짜 선택 닫기"
                className="grid size-10 place-items-center"
                onClick={() => setIsCalendarOpen(false)}
                type="button"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
              {Array.from({ length: 35 }, (_, index) => (
                <button
                  className={
                    index === 17
                      ? 'bg-primary text-primary-foreground aspect-square rounded-full'
                      : 'aspect-square rounded-full'
                  }
                  key={index}
                  onClick={() => setIsCalendarOpen(false)}
                  type="button"
                >
                  {index + 1 <= 30 ? index + 1 : ''}
                </button>
              ))}
            </div>
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
      <section className="bg-card mx-auto w-full max-w-[398px] rounded-3xl p-6">
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

export function PantryFlowPage({ state, view }: PantryFlowPageProps) {
  const mockState = getPantryMockState(state);
  const cardVariant = getPantryCardVariant(view);

  if (mockState === 'empty') return <PantryEmptyMock />;
  if (mockState === 'register' || mockState === 'edit')
    return <IngredientFormMock mode={mockState} />;

  return (
    <>
      <PantryPage cardVariant={cardVariant} />
      {mockState === 'delivery-complete' && <DeliveryCompleteDialog />}
      {mockState === 'delete-confirm' && <DeleteConfirmSheet />}
    </>
  );
}
