import { CalendarDays, CheckCircle2, PackageCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PantryPage } from '@/views/pantry/ui/pantry-page';

export type PantryMockState = 'empty' | 'full' | 'delivery-complete' | 'edit' | 'delete-confirm';

interface PantryFlowPageProps {
  state?: string;
}

export function getPantryMockState(state?: string): PantryMockState {
  if (
    state === 'empty' ||
    state === 'delivery-complete' ||
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
        <h1 className="text-xl font-semibold">나의 팬트리</h1>
        <Button asChild size="sm">
          <Link href="/pantry?state=edit">
            <Plus aria-hidden="true" />
            식재료 추가
          </Link>
        </Button>
      </header>
      <section className="bg-card mt-24 flex min-h-80 flex-col items-center justify-center rounded-3xl border px-6 text-center">
        <PackageCheck aria-hidden="true" className="text-primary size-12" />
        <h2 className="mt-5 text-lg font-semibold">아직 등록된 식재료가 없어요</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          식재료를 등록하거나 배송이 완료되면
          <br />
          나의 팬트리에 자동으로 담겨요.
        </p>
        <Button asChild className="mt-6">
          <Link href="/pantry?state=edit">식재료 등록하기</Link>
        </Button>
      </section>
    </main>
  );
}

function IngredientFormMock() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] px-4 pt-4 pb-10">
      <header className="flex h-12 items-center justify-between">
        <h1 className="text-xl font-semibold">식재료 등록</h1>
        <Link className="text-muted-foreground text-sm" href="/pantry?state=full">
          취소
        </Link>
      </header>
      <form className="mt-8 space-y-6">
        <label className="block">
          <span className="text-sm font-medium">식재료 이름</span>
          <input
            className="bg-card mt-2 h-12 w-full rounded-xl border px-4"
            defaultValue="대파"
            name="ingredientName"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">소비기한</span>
          <span className="bg-card mt-2 flex h-12 items-center justify-between rounded-xl border px-4 text-sm">
            <span>2026.09.01</span>
            <CalendarDays aria-hidden="true" className="text-muted-foreground size-4" />
          </span>
        </label>
        <fieldset>
          <legend className="text-sm font-medium">보관 방법</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              className="bg-primary text-primary-foreground rounded-xl py-3 text-sm"
              type="button"
            >
              냉장
            </button>
            <button className="bg-card rounded-xl border py-3 text-sm" type="button">
              냉동
            </button>
            <button className="bg-card rounded-xl border py-3 text-sm" type="button">
              실온
            </button>
          </div>
        </fieldset>
        <label className="block">
          <span className="text-sm font-medium">
            메모 <span className="text-muted-foreground font-normal">선택</span>
          </span>
          <textarea
            className="bg-card mt-2 min-h-24 w-full rounded-xl border p-4 text-sm"
            placeholder="구입량이나 보관 위치를 적어주세요."
          />
        </label>
        <Button asChild className="h-12 w-full">
          <Link href="/pantry?state=full">등록 완료</Link>
        </Button>
      </form>
    </main>
  );
}

function DeliveryCompleteDialog() {
  return (
    <div
      aria-label="배송 완료 식재료 등록"
      aria-modal="true"
      className="fixed inset-0 z-10 flex items-end bg-black/40 p-4"
      role="dialog"
    >
      <section className="bg-card mx-auto w-full max-w-[398px] rounded-3xl p-6">
        <CheckCircle2 aria-hidden="true" className="text-primary size-10" />
        <h2 className="mt-4 text-lg font-semibold">배송이 완료됐어요</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
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
      className="fixed inset-0 z-10 flex items-end bg-black/40"
      role="dialog"
    >
      <section className="bg-card w-full rounded-t-3xl p-6 pb-8">
        <div className="bg-muted mx-auto h-1.5 w-12 rounded-full" />
        <h2 className="mt-6 text-lg font-semibold">대파를 팬트리에서 삭제할까요?</h2>
        <p className="text-muted-foreground mt-2 text-sm">
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

function PantryFullActions() {
  return (
    <div className="mx-auto -mt-7 flex max-w-[430px] gap-2 px-4">
      <Button asChild className="flex-1" variant="outline">
        <Link href="/pantry?state=edit">
          <Pencil aria-hidden="true" />
          식재료 등록/수정
        </Link>
      </Button>
      <Button asChild className="flex-1" variant="outline">
        <Link href="/pantry?state=delete-confirm">
          <Trash2 aria-hidden="true" />
          삭제 확인
        </Link>
      </Button>
    </div>
  );
}

export function PantryFlowPage({ state }: PantryFlowPageProps) {
  const mockState = getPantryMockState(state);

  if (mockState === 'empty') return <PantryEmptyMock />;
  if (mockState === 'edit') return <IngredientFormMock />;

  return (
    <>
      <PantryPage />
      <PantryFullActions />
      {mockState === 'delivery-complete' && <DeliveryCompleteDialog />}
      {mockState === 'delete-confirm' && <DeleteConfirmSheet />}
    </>
  );
}
