import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';

import type { TossPaymentOrder } from '@/features/payment/model/payment-flow';

interface TossCardPaymentRequest {
  amount: { currency: 'KRW'; value: number };
  failUrl: string;
  method: 'CARD';
  orderId: string;
  orderName: string;
  successUrl: string;
  windowTarget: 'self';
}

interface TossSdkAdapter {
  payment: (params: { customerKey: string }) => {
    requestPayment: (request: TossCardPaymentRequest) => Promise<void>;
  };
}

interface RequestTossPaymentOptions {
  clientKey?: string;
  loadSdk?: (clientKey: string) => Promise<TossSdkAdapter>;
  origin?: string;
  storage?: Pick<Storage, 'setItem'>;
}

async function loadTossSdk(clientKey: string): Promise<TossSdkAdapter> {
  const sdk = await loadTossPayments(clientKey);

  return {
    payment: (params) => {
      const payment = sdk.payment(params);

      return {
        requestPayment: (request) => payment.requestPayment(request),
      };
    },
  };
}

export async function requestTossPayment(
  order: TossPaymentOrder,
  {
    clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    loadSdk = loadTossSdk,
    origin,
    storage,
  }: RequestTossPaymentOptions = {},
) {
  if (!clientKey) {
    throw new Error('NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수가 필요합니다.');
  }

  const paymentOrigin = origin ?? window.location.origin;
  const paymentStorage = storage ?? window.sessionStorage;
  const tossPayments = await loadSdk(clientKey);
  const payment = tossPayments.payment({ customerKey: ANONYMOUS });

  paymentStorage.setItem(
    'order-payment-attempt',
    JSON.stringify({ amount: order.totalAmount, orderId: order.orderId }),
  );

  await payment.requestPayment({
    amount: { currency: 'KRW', value: order.totalAmount },
    failUrl: `${paymentOrigin}/payment/fail`,
    method: 'CARD',
    orderId: order.orderId,
    orderName: order.name,
    successUrl: `${paymentOrigin}/payment/success`,
    windowTarget: 'self',
  });
}
