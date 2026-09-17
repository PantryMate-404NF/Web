import { orderPaymentRequest } from '@/shared/api/order-payment-client';

export function deleteCartItem(cartItemId: number) {
  return orderPaymentRequest(`/carts/items/${cartItemId}`, {
    method: 'DELETE',
    responseType: 'none',
  });
}
