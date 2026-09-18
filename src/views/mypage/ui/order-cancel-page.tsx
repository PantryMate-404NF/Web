'use client';

/** 주문 취소 사유와 환불 정보를 확인한 뒤 완료 화면으로 이동 */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check } from 'lucide-react';

import { getOrderHistoryMock } from '@/entities/order/model/mock';

import { isOrderCancellationSubmittable } from '../model/order-cancel';

const cancellationReasons = [
  '단순 변심',
  '상품 옵션 변경',
  '추가 주문',
  '결제 수단 변경',
  '배송 정보 변경',
  '기타',
] as const;

export function getCancellationReasonBorderColor(checked: boolean) {
  return checked ? 'var(--primitive-primary-500)' : 'var(--border-default)';
}

export function getAgreementCheckClassName(agreed: boolean) {
  return agreed
    ? 'bg-[var(--primitive-primary-500)] text-[var(--primitive-grey-800)]'
    : 'bg-surface-disabled text-disabled';
}

export function OrderCancelPage({ orderId }: { orderId: string }) {
  const router = useRouter();
  const order = getOrderHistoryMock(orderId);
  const [selectedReason, setSelectedReason] = useState<string>();
  const [agreed, setAgreed] = useState(false);
  const isSubmittable = isOrderCancellationSubmittable(selectedReason, agreed);

  if (!order) {
    return null;
  }

  function submitCancellation() {
    if (!isSubmittable) {
      return;
    }

    router.push(`/mypage/orders/${orderId}/cancel/complete`);
  }

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col">
      <header className="border-border relative flex h-16 items-center justify-center border-b px-4">
        <Link
          aria-label="주문 상세로 돌아가기"
          className="absolute left-4 grid size-8 place-items-center"
          href={`/mypage/orders/${order.id}`}
        >
          <Image
            alt=""
            aria-hidden="true"
            height={24}
            src="/images/mypage/back-arrow.svg"
            width={24}
          />
        </Link>
        <h1 className="text-heading-4 font-semibold">주문 취소</h1>
      </header>

      <section className="px-4 py-6" aria-labelledby="cancellation-reason-heading">
        <fieldset>
          <legend className="text-base leading-6 font-semibold" id="cancellation-reason-heading">
            취소 사유 선택
          </legend>
          <div className="mt-4 space-y-2">
            {cancellationReasons.map((reason) => {
              const checked = selectedReason === reason;

              return (
                <label
                  className="border-border flex h-12 cursor-pointer items-center gap-3 rounded-xl border px-4"
                  key={reason}
                  style={{ borderColor: getCancellationReasonBorderColor(checked) }}
                >
                  <input
                    checked={checked}
                    className="sr-only"
                    name="cancellation-reason"
                    onChange={() => setSelectedReason(reason)}
                    type="radio"
                    value={reason}
                  />
                  <span
                    aria-hidden="true"
                    className={`grid size-5 place-items-center rounded-full border ${
                      checked ? 'border-primary' : 'border-border'
                    }`}
                  >
                    {checked ? <span className="bg-primary size-2 rounded-full" /> : null}
                  </span>
                  <span className="text-text-secondary text-sm leading-5 font-medium">
                    {reason}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>

      <section
        className="border-border border-t-8 px-4 py-6"
        aria-labelledby="refund-information-heading"
      >
        <h2 className="text-lg leading-7 font-semibold" id="refund-information-heading">
          환불 정보
        </h2>
        <dl className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <dt className="text-base leading-6 font-medium text-[var(--text-secondary)]">
              주문 금액
            </dt>
            <dd className="leading-6 font-medium text-[var(--text-secondary)]">
              {order.refund.orderAmount.toLocaleString()}원
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-base leading-6 font-medium text-[var(--text-secondary)]">배송비</dt>
            <dd className="leading-6 font-medium text-[var(--text-secondary)]">
              {order.refund.deliveryFee.toLocaleString()}원
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-base leading-6 font-medium text-[var(--primitive-black)]">
              환불 수단
            </dt>
            <dd className="text-lg leading-7 font-medium">{order.paymentMethod}</dd>
          </div>
          <div className="border-border mt-4 flex items-center justify-between border-t pt-5">
            <dt className="text-base leading-6 font-semibold text-[var(--primitive-primary-700)]">
              환불 예정 금액
            </dt>
            <dd className="text-xl leading-7 font-semibold text-[var(--primitive-primary-700)]">
              {order.refund.estimatedAmount.toLocaleString()}원
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex-1" />

      <footer className="bg-background sticky bottom-0 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <label className="text-text-secondary flex cursor-pointer items-center gap-2 text-xs leading-4 font-medium">
          <input
            checked={agreed}
            className="sr-only"
            onChange={(event) => setAgreed(event.target.checked)}
            type="checkbox"
          />
          <span
            aria-hidden="true"
            className={`grid size-[22px] shrink-0 place-items-center rounded-full ${getAgreementCheckClassName(
              agreed,
            )}`}
          >
            <Check className="size-3.5" strokeWidth={2} />
          </span>
          [필수] 주문 취소 내역에 동의
        </label>
        <button
          className="bg-primary text-primary-foreground disabled:bg-disabled disabled:text-text-secondary mt-4 h-15 w-full rounded-xl text-lg leading-7 font-semibold"
          disabled={!isSubmittable}
          onClick={submitCancellation}
          type="button"
        >
          주문 취소
        </button>
      </footer>
    </main>
  );
}
