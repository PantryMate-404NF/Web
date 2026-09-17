import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { PaymentPrepareResponseDto } from './payment.dto';

export function preparePayment(orderId: string) {
  return orderPaymentRequest<PaymentPrepareResponseDto>(`/payments/${orderId}/prepare`, {
    method: 'POST',
  });
}
