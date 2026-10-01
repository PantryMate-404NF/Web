import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { OrderDetailDto } from './order.dto';

export function getOrderDetail(orderId: string) {
  return orderPaymentRequest<OrderDetailDto>(`/orders/${encodeURIComponent(orderId)}`);
}
