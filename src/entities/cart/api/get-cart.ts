import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { CartResponseDto } from './cart.dto';

export function getCart() {
  return orderPaymentRequest<CartResponseDto>('/carts');
}
