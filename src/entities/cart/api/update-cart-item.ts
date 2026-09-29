import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { CartItemMutationResponseDto } from './cart.dto';

export function updateCartItem(cartItemId: number, quantity: number) {
  return orderPaymentRequest<CartItemMutationResponseDto>(`/carts/items/${cartItemId}`, {
    body: { quantity },
    method: 'PATCH',
  });
}
