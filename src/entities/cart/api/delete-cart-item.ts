import { orderPaymentRequest } from '@/shared/api/order-payment-client';

export function deleteCartItem(cartItemId: number) {
  return orderPaymentRequest<void>(`/carts/items/${cartItemId}`, {
    method: 'DELETE',
  });
}
