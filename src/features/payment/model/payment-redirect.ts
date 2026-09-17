import type { PaymentConfirmRequestDto } from '@/features/payment/api/payment.dto';

export interface PaymentAttempt {
  amount: number;
  orderId: string;
}

interface PaymentSuccessParams {
  amount?: string;
  orderId?: string;
  paymentKey?: string;
}

export function parsePaymentSuccessParams(
  params: PaymentSuccessParams,
  expectedAttempt?: PaymentAttempt | null,
): PaymentConfirmRequestDto | null {
  const amount = Number(params.amount);

  if (!params.amount || !params.orderId || !params.paymentKey) return null;
  if (!Number.isSafeInteger(amount) || amount <= 0) return null;
  if (
    expectedAttempt &&
    (expectedAttempt.amount !== amount || expectedAttempt.orderId !== params.orderId)
  ) {
    return null;
  }

  return { amount, orderId: params.orderId, paymentKey: params.paymentKey };
}

export function readPaymentAttempt(storage: Pick<Storage, 'getItem'>): PaymentAttempt | null {
  const storedAttempt = storage.getItem('order-payment-attempt');

  if (!storedAttempt) return null;

  try {
    const attempt = JSON.parse(storedAttempt) as Partial<PaymentAttempt>;

    return typeof attempt.amount === 'number' && typeof attempt.orderId === 'string'
      ? { amount: attempt.amount, orderId: attempt.orderId }
      : null;
  } catch {
    return null;
  }
}

export function getPaymentErrorMessage(error: { code?: string | null }) {
  switch (error.code) {
    case 'AMOUNT_MISMATCH':
      return '주문 금액이 변경되어 결제를 완료하지 못했어요.';
    case 'PAYMENT_FAILED':
      return '결제 승인이 실패했어요. 다른 결제수단을 이용해 주세요.';
    case 'INSUFFICIENT_STOCK':
      return '재고가 부족해 결제가 자동으로 취소됐어요.';
    case 'PAYMENT_IN_PROGRESS':
      return '결제를 처리하고 있어요. 잠시 후 다시 확인해 주세요.';
    default:
      return '결제를 완료하지 못했어요. 주문 정보를 확인해 주세요.';
  }
}
