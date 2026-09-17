'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { confirmPayment } from '@/features/payment/api/confirm-payment';
import {
  getPaymentErrorMessage,
  parsePaymentSuccessParams,
  readPaymentAttempt,
} from '@/features/payment/model/payment-redirect';
import { ApiError } from '@/shared/api/api-error';

interface PaymentSuccessPageProps {
  amount?: string;
  orderId?: string;
  paymentKey?: string;
}

type ConfirmState =
  { status: 'confirming' } | { status: 'done' } | { message: string; status: 'error' };

export function PaymentSuccessPage({ amount, orderId, paymentKey }: PaymentSuccessPageProps) {
  const [state, setState] = useState<ConfirmState>({ status: 'confirming' });
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (hasConfirmedRef.current) return;
    hasConfirmedRef.current = true;

    async function runConfirmation() {
      const attempt = readPaymentAttempt(window.sessionStorage);
      const confirmInput = parsePaymentSuccessParams({ amount, orderId, paymentKey }, attempt);

      if (!confirmInput) {
        await Promise.resolve();
        setState({
          message: '결제 정보가 올바르지 않아요. 주문 내역을 확인해 주세요.',
          status: 'error',
        });
        return;
      }

      try {
        await confirmPayment(confirmInput);
        window.sessionStorage.removeItem('order-payment-attempt');
        setState({ status: 'done' });
      } catch (error) {
        setState({
          message: getPaymentErrorMessage(error instanceof ApiError ? error : {}),
          status: 'error',
        });
      }
    }

    void runConfirmation();
  }, [amount, orderId, paymentKey]);

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {state.status === 'confirming' ? (
        <>
          <div className="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent" />
          <h1 className="text-title-2 mt-6 font-semibold">결제를 확인하고 있어요</h1>
          <p className="text-text-secondary mt-2 text-sm">화면을 닫지 말고 잠시만 기다려 주세요.</p>
        </>
      ) : null}

      {state.status === 'done' ? (
        <>
          <h1 className="text-title-2 font-semibold">결제가 완료됐어요</h1>
          <p className="text-text-secondary mt-2 text-sm">주문과 재고 반영이 완료되었습니다.</p>
          <Link
            className="bg-primary text-primary-foreground mt-8 rounded-xl px-6 py-3 font-semibold"
            href="/"
          >
            홈으로 이동
          </Link>
        </>
      ) : null}

      {state.status === 'error' ? (
        <>
          <h1 className="text-title-2 font-semibold">결제를 완료하지 못했어요</h1>
          <p className="text-text-secondary mt-2 text-sm" role="alert">
            {state.message}
          </p>
          <Link
            className="border-border mt-8 rounded-xl border px-6 py-3 font-semibold"
            href="/cart"
          >
            장바구니 확인
          </Link>
        </>
      ) : null}
    </main>
  );
}
