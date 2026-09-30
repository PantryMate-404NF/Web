import type { OrderCreateRequestDto, OrderCreateResponseDto } from '@/entities/order/api/order.dto';
import type { PaymentPrepareResponseDto } from '@/features/payment/api/payment.dto';
import {
  buildPaymentCompletionSnapshot,
  type PaymentCompletionDetails,
  type PaymentCompletionSnapshot,
} from './payment-completion';

export interface TossPaymentOrder {
  completionSnapshot?: PaymentCompletionSnapshot;
  name: string;
  orderId: string;
  totalAmount: number;
}

interface PaymentExecutionInput extends OrderCreateRequestDto {
  completionDetails: PaymentCompletionDetails;
  idempotencyKey: string;
}

interface PaymentExecutorDependencies {
  createOrder: (
    input: OrderCreateRequestDto,
    idempotencyKey: string,
  ) => Promise<OrderCreateResponseDto>;
  preparePayment: (orderId: string) => Promise<PaymentPrepareResponseDto>;
  requestPayment: (order: TossPaymentOrder) => Promise<void>;
}

export function createPaymentExecutor(dependencies: PaymentExecutorDependencies) {
  let inFlight: Promise<void> | null = null;
  let order: OrderCreateResponseDto | null = null;
  let isPrepared = false;

  return function executePayment({
    completionDetails,
    idempotencyKey,
    ...orderInput
  }: PaymentExecutionInput) {
    if (inFlight) return inFlight;

    inFlight = (async () => {
      order ??= await dependencies.createOrder(orderInput, idempotencyKey);

      if (!isPrepared) {
        await dependencies.preparePayment(order.orderId);
        isPrepared = true;
      }

      await dependencies.requestPayment({
        completionSnapshot: buildPaymentCompletionSnapshot({
          ...completionDetails,
          order,
          selectedCartItemIds: orderInput.selectedCartItemIds,
        }),
        name: order.name,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
      });
    })().finally(() => {
      inFlight = null;
    });

    return inFlight;
  };
}
