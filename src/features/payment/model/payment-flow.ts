import type { OrderCreateRequestDto, OrderCreateResponseDto } from '@/entities/order/api/order.dto';
import type { PaymentPrepareResponseDto } from '@/features/payment/api/payment.dto';

export interface TossPaymentOrder {
  name: string;
  orderId: string;
  totalAmount: number;
}

interface PaymentExecutionInput extends OrderCreateRequestDto {
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

  return function executePayment({ idempotencyKey, ...orderInput }: PaymentExecutionInput) {
    if (inFlight) return inFlight;

    inFlight = (async () => {
      const order = await dependencies.createOrder(orderInput, idempotencyKey);

      await dependencies.preparePayment(order.orderId);
      await dependencies.requestPayment({
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
