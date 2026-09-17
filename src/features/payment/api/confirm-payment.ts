import { orderPaymentRequest } from '@/shared/api/order-payment-client';

import type { PaymentConfirmRequestDto, PaymentConfirmResponseDto } from './payment.dto';

export function confirmPayment(input: PaymentConfirmRequestDto) {
  return orderPaymentRequest<PaymentConfirmResponseDto>('/payments/confirm', {
    body: input,
    method: 'POST',
  });
}
