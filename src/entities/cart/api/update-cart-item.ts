import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { CartItemMutationResponseDto } from './cart.dto';
import { getCartRequestHeaders } from './cart-request-headers';

export function updateCartItem(cartItemId: number, quantity: number) {
  return orderPaymentRequest<CartItemMutationResponseDto>(`/carts/items/${cartItemId}`, {
    body: { quantity },
    headers: getCartRequestHeaders(),
    method: 'PATCH',
  });
}
