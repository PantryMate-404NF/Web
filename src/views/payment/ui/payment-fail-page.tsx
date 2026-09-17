'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { requestTossPayment } from '@/features/payment/lib/request-toss-payment';
import { readPaymentAttempt, type PaymentAttempt } from '@/features/payment/model/payment-redirect';

export function PaymentFailPage({
  code,
  initialAttempt,
}: {
  code?: string;
  initialAttempt?: PaymentAttempt | null;
}) {
  const isCanceled = code === 'PAY_PROCESS_CANCELED';
  const [attempt, setAttempt] = useState<PaymentAttempt | null | undefined>(initialAttempt);
  const [retryError, setRetryError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (initialAttempt !== undefined) return;

    const restoreTimer = window.setTimeout(() => {
      setAttempt(readPaymentAttempt(window.sessionStorage));
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, [initialAttempt]);

  async function retryPayment() {
    if (!attempt) return;

    setIsRetrying(true);
    setRetryError('');

    try {
      await requestTossPayment({
        name: attempt.name,
        orderId: attempt.orderId,
        totalAmount: attempt.amount,
      });
    } catch (error) {
      setRetryError(error instanceof Error ? error.message : '결제창을 다시 열지 못했습니다.');
      setIsRetrying(false);
    }
  }

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-title-2 font-semibold">
        {isCanceled ? '결제가 취소됐어요' : '결제를 진행하지 못했어요'}
      </h1>
      <p className="text-text-secondary mt-2 text-sm">
        {attempt
          ? '기존 주문으로 결제를 다시 진행할 수 있어요.'
          : '장바구니에서 주문 상품을 다시 확인해 주세요.'}
      </p>
      {retryError ? (
        <p className="text-destructive mt-3 text-sm" role="alert">
          {retryError}
        </p>
      ) : null}
      {attempt === undefined ? (
        <p className="text-text-secondary mt-8 text-sm">결제 정보를 확인하고 있어요.</p>
      ) : attempt ? (
        <button
          className="bg-primary text-primary-foreground mt-8 rounded-xl px-6 py-3 font-semibold disabled:opacity-50"
          disabled={isRetrying}
          onClick={() => {
            void retryPayment();
          }}
          type="button"
        >
          {isRetrying ? '결제창 여는 중' : '결제 다시 시도'}
        </button>
      ) : (
        <Link
          className="bg-primary text-primary-foreground mt-8 rounded-xl px-6 py-3 font-semibold"
          href="/cart"
        >
          장바구니로 이동
        </Link>
      )}
    </main>
  );
}
