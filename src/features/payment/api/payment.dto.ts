export type PaymentStatus =
  'READY' | 'IN_PROGRESS' | 'DONE' | 'ABORTED' | 'EXPIRED' | 'CANCELED' | 'UNKNOWN_HOLD';

export interface PaymentPrepareResponseDto {
  paymentId: number;
  orderId: string;
  totalAmount: number;
  status: PaymentStatus;
}

export interface PaymentConfirmRequestDto {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmResponseDto {
  paymentKey: string;
  totalAmount: number;
  status: PaymentStatus;
  approveAt: string;
}
