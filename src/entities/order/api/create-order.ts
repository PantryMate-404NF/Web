import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { OrderCreateRequestDto, OrderCreateResponseDto } from './order.dto';

export function createOrder(input: OrderCreateRequestDto, idempotencyKey: string) {
  return orderPaymentRequest<OrderCreateResponseDto>('/orders', {
    body: input,
    headers: { 'Idempotency-Key': idempotencyKey },
    method: 'POST',
  });
}
