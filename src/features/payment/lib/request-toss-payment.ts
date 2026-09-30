import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';

import type { TossPaymentOrder } from '@/features/payment/model/payment-flow';

interface TossWidgetPaymentRequest {
  failUrl: string;
  orderId: string;
  orderName: string;
  successUrl: string;
  windowTarget: 'self';
}

interface TossPaymentWindow {
  on(eventName: 'paymentRequest' | 'cancel', callback: () => Promise<void>): void;
}

interface TossWidgets {
  renderPaymentWindow: () => Promise<TossPaymentWindow>;
  requestPayment: (request: TossWidgetPaymentRequest) => Promise<unknown>;
  setAmount: (amount: { currency: 'KRW'; value: number }) => Promise<void>;
}

interface TossSdkAdapter {
  widgets: (params: { customerKey: string }) => TossWidgets;
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
    widgets: (params) => {
      const widgets = sdk.widgets(params);

      return {
        renderPaymentWindow: async () => {
          const paymentWindow = await widgets.renderPaymentWindow();

          return {
            on: (eventName, callback) => {
              if (eventName === 'paymentRequest') {
                paymentWindow.on(eventName, async () => callback());
                return;
              }

              paymentWindow.on(eventName, callback);
            },
          };
        },
        requestPayment: (request) => widgets.requestPayment(request),
        setAmount: (amount) => widgets.setAmount(amount),
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
  const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

  paymentStorage.setItem(
    'order-payment-attempt',
    JSON.stringify({
      amount: order.totalAmount,
      ...(order.completionSnapshot ? { completionSnapshot: order.completionSnapshot } : {}),
      name: order.name,
      orderId: order.orderId,
    }),
  );

  await widgets.setAmount({ currency: 'KRW', value: order.totalAmount });
  const paymentWindow = await widgets.renderPaymentWindow();

  await new Promise<void>((resolve, reject) => {
    paymentWindow.on('paymentRequest', async () => {
      try {
        await widgets.requestPayment({
          failUrl: `${paymentOrigin}/payment/fail`,
          orderId: order.orderId,
          orderName: order.name,
          successUrl: `${paymentOrigin}/payment/success`,
          windowTarget: 'self',
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    paymentWindow.on('cancel', async () => {
      resolve();
    });
  });
}
