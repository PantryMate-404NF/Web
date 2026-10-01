'use client';

/** 실제 취소 요청을 전송하고 결과를 표시합니다. */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Check } from 'lucide-react';

import { cancelOrder } from '@/entities/order/api/cancel-order';
import { useOrderDetailQuery } from '@/entities/order/api/use-order-detail-query';
import { getOrderDetailQueryKey, ORDER_LIST_QUERY_KEY } from '@/entities/order/model/query-key';

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

export function getCancellationReasonRadioClasses(checked: boolean) {
  return checked
    ? { outer: 'bg-primary', inner: 'bg-background' }
    : { outer: 'border border-border', inner: '' };
}

export function getAgreementCheckClassName(agreed: boolean) {
  return agreed
    ? 'bg-[var(--primitive-primary-500)] text-[var(--primitive-grey-800)]'
    : 'bg-surface-disabled text-disabled';
}

export function OrderCancelPage({ orderId }: { orderId: string }) {
  const { data: order, isError, isPending, refetch } = useOrderDetailQuery(orderId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedReason, setSelectedReason] = useState<string>();
  const [agreed, setAgreed] = useState(false);
  const cancellation = useMutation({
    mutationFn: (cancelReason: string) => cancelOrder(orderId, cancelReason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDER_LIST_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: getOrderDetailQueryKey(orderId) });
      router.push(`/mypage/orders/${encodeURIComponent(orderId)}/cancel/complete`);
    },
  });

  function submitCancellation() {
    if (!selectedReason || !agreed) return;
    cancellation.mutate(selectedReason);
  }

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col">
      <header className="border-border relative flex h-16 items-center justify-center border-b px-4">
        <Link
          aria-label="주문 상세로 돌아가기"
          className="absolute left-4 grid size-8 place-items-center"
          href={`/mypage/orders/${encodeURIComponent(orderId)}`}
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

      {isPending ? (
        <p className="text-text-secondary px-4 py-10 text-center" role="status">
          주문 상세를 불러오는 중이에요.
        </p>
      ) : isError || !order ? (
        <div className="px-4 py-10 text-center">
          <p className="text-text-secondary" role="alert">
            주문 정보를 불러오지 못했어요.
          </p>
          <button className="text-primary mt-4 font-semibold" onClick={() => void refetch()}>
            다시 시도
          </button>
        </div>
      ) : (
        <>
          <section className="px-4 py-6" aria-labelledby="cancellation-reason-heading">
            <fieldset>
              <legend
                className="text-base leading-6 font-semibold"
                id="cancellation-reason-heading"
              >
                취소 사유 선택
              </legend>
              <div className="mt-4 space-y-2">
                {cancellationReasons.map((reason) => {
                  const checked = selectedReason === reason;
                  const radioClasses = getCancellationReasonRadioClasses(checked);

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
                        className={`grid size-5 place-items-center rounded-full ${radioClasses.outer}`}
                      >
                        {checked ? (
                          <span className={`size-2 rounded-full ${radioClasses.inner}`} />
                        ) : null}
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

          {cancellation.isError ? (
            <p className="text-destructive px-4 py-2 text-sm" role="alert">
              주문 취소를 요청하지 못했어요. 잠시 후 다시 시도해 주세요.
            </p>
          ) : null}

          <div aria-hidden="true" className="h-2 w-full bg-[var(--primitive-grey-100)]" />

          <section className="px-4 py-6" aria-labelledby="refund-information-heading">
            <h2 className="text-lg leading-7 font-semibold" id="refund-information-heading">
              결제 정보
            </h2>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-base leading-6 font-medium text-[var(--text-secondary)]">
                  결제 금액
                </dt>
                <dd className="leading-6 font-medium text-[var(--text-secondary)]">
                  {order.totalAmount.toLocaleString()}원
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-base leading-6 font-medium text-[var(--primitive-black)]">
                  환불 수단
                </dt>
                <dd className="text-lg leading-7 font-medium">
                  {order.payment?.method ?? '확인 중'}
                </dd>
              </div>
            </dl>
          </section>
        </>
      )}

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
          disabled={
            !isOrderCancellationSubmittable(selectedReason, agreed) || cancellation.isPending
          }
          onClick={submitCancellation}
          type="button"
        >
          {cancellation.isPending ? '취소 요청 중…' : '주문 취소'}
        </button>
      </footer>
    </main>
  );
}
