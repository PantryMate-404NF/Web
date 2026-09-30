import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { CartResponseDto } from './cart.dto';
import { getCartRequestHeaders } from './cart-request-headers';

export function getCart() {
  return orderPaymentRequest<CartResponseDto>('/carts', {
    headers: getCartRequestHeaders(),
  });
}
