import { orderPaymentRequest } from '@/shared/api/order-payment-client';

export function cancelOrder(orderId: string, cancelReason: string) {
  return orderPaymentRequest(`/payments/${encodeURIComponent(orderId)}/cancel`, {
    method: 'POST',
    body: { cancelReason },
    responseType: 'none',
  });
}
