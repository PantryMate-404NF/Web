import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import { getCartRequestHeaders } from './cart-request-headers';

export function deleteCartItem(cartItemId: number) {
  return orderPaymentRequest(`/carts/items/${cartItemId}`, {
    headers: getCartRequestHeaders(),
    method: 'DELETE',
    responseType: 'none',
  });
}
