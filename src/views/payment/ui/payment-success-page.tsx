'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { deleteCartItem } from '@/entities/cart/api/delete-cart-item';
import { getCart } from '@/entities/cart/api/get-cart';
import { CART_QUERY_KEY } from '@/entities/cart/model/query-key';
import { ORDER_LIST_QUERY_KEY } from '@/entities/order/model/query-key';
import { confirmPayment } from '@/features/payment/api/confirm-payment';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { cleanupPurchasedCartItems } from '@/features/payment/model/cleanup-purchased-cart';
import {
  getPaymentCompletionCartItemIds,
  type PaymentCompletionSnapshot,
} from '@/features/payment/model/payment-completion';
import {
  confirmAfterSessionRestore,
  confirmPaymentThenCleanupCart,
  getPaymentErrorMessage,
  parsePaymentSuccessParams,
  readPaymentAttempt,
} from '@/features/payment/model/payment-redirect';
import { ApiError } from '@/shared/api/api-error';
import { CART_HREF } from '@/shared/config/cart-write-mode';

import { PaymentCompleteView } from './payment-complete-view';

interface PaymentSuccessPageProps {
  amount?: string;
  orderId?: string;
  paymentKey?: string;
}

type ConfirmState =
  | { status: 'confirming' }
  | { order: PaymentCompletionSnapshot; status: 'done' }
  | {
      order: PaymentCompletionSnapshot;
      remainingCartItemIds: number[];
      status: 'cart-cleanup-error';
      retryMessage?: string;
    }
  | { message: string; status: 'error'; title?: string };

export function PaymentSuccessPage({ amount, orderId, paymentKey }: PaymentSuccessPageProps) {
  const [state, setState] = useState<ConfirmState>({ status: 'confirming' });
  const hasConfirmedRef = useRef(false);
  const { restore } = useAuthSession();
  const queryClient = useQueryClient();
  const [isRetryingCartCleanup, setIsRetryingCartCleanup] = useState(false);

  const cleanupCartItems = useCallback(
    (cartItemIds: number[]) =>
      cleanupPurchasedCartItems(cartItemIds, {
        deleteItem: deleteCartItem,
        refreshCart: async () => {
          await queryClient.invalidateQueries({
            queryKey: CART_QUERY_KEY,
            refetchType: 'none',
          });
          const cart = await queryClient.fetchQuery({ queryKey: CART_QUERY_KEY, queryFn: getCart });
          return cart.items.map((item) => item.cartItemId);
        },
      }),
    [queryClient],
  );

  async function retryCartCleanup() {
    if (state.status !== 'cart-cleanup-error') return;

    setIsRetryingCartCleanup(true);
    try {
      const sessionState = await restore();
      if (sessionState === 'guest') {
        setState({
          ...state,
          retryMessage: '로그인 정보를 확인하지 못했어요. 로그인한 뒤 다시 시도해 주세요.',
        });
        return;
      }

      const result = await cleanupCartItems(state.remainingCartItemIds);

      if (result.completed) {
        window.sessionStorage.removeItem('order-payment-attempt');
        setState({ order: state.order, status: 'done' });
      } else {
        setState({
          ...state,
          remainingCartItemIds: result.remainingCartItemIds,
          retryMessage: '장바구니를 다시 확인하지 못했어요. 잠시 후 다시 시도해 주세요.',
        });
      }
    } catch {
      setState({
        ...state,
        retryMessage: '장바구니를 정리하지 못했어요. 잠시 후 다시 시도해 주세요.',
      });
    } finally {
      setIsRetryingCartCleanup(false);
    }
  }

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
        const confirmation = await confirmAfterSessionRestore(restore, () =>
          confirmPaymentThenCleanupCart(
            () => confirmPayment(confirmInput),
            (result) => result.status === 'DONE',
            () => cleanupCartItems(getPaymentCompletionCartItemIds(attempt?.completionSnapshot)),
          ),
        );

        if (confirmation.status === 'unauthenticated') {
          setState({
            message:
              '로그인 정보를 확인하지 못해 결제를 마무리하지 못했어요. 주문 상태를 확인해 주세요.',
            status: 'error',
          });
          return;
        }

        if (confirmation.value.confirmation.status !== 'DONE') {
          setState({
            message: '결제 승인 상태가 아직 완료되지 않아 장바구니 상품을 유지했어요.',
            status: 'error',
            title: '결제 상태를 확인하고 있어요',
          });
          return;
        }

        await queryClient.invalidateQueries({ queryKey: ORDER_LIST_QUERY_KEY });

        if (!attempt?.completionSnapshot) {
          setState({
            message: '결제는 완료되었지만 주문 상세 정보를 확인하지 못했어요.',
            status: 'error',
            title: '결제는 완료되었어요',
          });
          return;
        }

        const order = {
          ...attempt.completionSnapshot,
          orderNumber: confirmInput.orderId,
          paymentAmount: confirmation.value.confirmation.totalAmount,
        };

        if (confirmation.value.cleanupResult && !confirmation.value.cleanupResult.completed) {
          setState({
            order,
            remainingCartItemIds: confirmation.value.cleanupResult.remainingCartItemIds,
            status: 'cart-cleanup-error',
          });
          return;
        }

        window.sessionStorage.removeItem('order-payment-attempt');
        setState({ order, status: 'done' });
      } catch (error) {
        setState({
          message: getPaymentErrorMessage(error instanceof ApiError ? error : {}),
          status: 'error',
        });
      }
    }

    void runConfirmation();
  }, [amount, cleanupCartItems, orderId, paymentKey, queryClient, restore]);

  if (state.status === 'done') return <PaymentCompleteView order={state.order} />;

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {state.status === 'confirming' ? (
        <>
          <div className="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent" />
          <h1 className="text-title-2 mt-6 font-semibold">결제를 확인하고 있어요</h1>
          <p className="text-text-secondary mt-2 text-sm">화면을 닫지 말고 잠시만 기다려 주세요.</p>
        </>
      ) : null}

      {state.status === 'error' ? (
        <>
          <h1 className="text-title-2 font-semibold">
            {state.title ?? '결제를 완료하지 못했어요'}
          </h1>
          <p className="text-text-secondary mt-2 text-sm" role="alert">
            {state.message}
          </p>
          <Link
            className="border-border mt-8 rounded-xl border px-6 py-3 font-semibold"
            href={CART_HREF}
          >
            장바구니 확인
          </Link>
        </>
      ) : null}

      {state.status === 'cart-cleanup-error' ? (
        <>
          <h1 className="text-title-2 font-semibold">결제는 완료되었어요</h1>
          <p className="text-text-secondary mt-2 text-sm" role="alert">
            구매한 상품 중 일부가 장바구니에 남아 있어요. 다시 정리해 주세요.
          </p>
          {state.retryMessage ? (
            <p className="text-text-secondary mt-2 text-sm" role="status">
              {state.retryMessage}
            </p>
          ) : null}
          <button
            className="bg-primary text-primary-foreground mt-8 rounded-xl px-6 py-3 font-semibold disabled:opacity-50"
            disabled={isRetryingCartCleanup}
            onClick={() => void retryCartCleanup()}
            type="button"
          >
            {isRetryingCartCleanup ? '장바구니 정리 중…' : '장바구니 정리 다시 시도'}
          </button>
          <Link className="mt-4 font-semibold" href={CART_HREF}>
            장바구니 확인
          </Link>
        </>
      ) : null}
    </main>
  );
}
