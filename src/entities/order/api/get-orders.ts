import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { OrderListResponseDto, OrderStatus } from './order.dto';

export interface OrderListParams {
  status?: OrderStatus;
  page?: number;
  size?: number;
}

export function getOrders({ status, page = 0, size = 20 }: OrderListParams = {}) {
  const searchParams = new URLSearchParams();
  if (status) searchParams.set('status', status);
  searchParams.set('page', String(page));
  searchParams.set('size', String(size));

  return orderPaymentRequest<OrderListResponseDto>(`/orders?${searchParams.toString()}`);
}
