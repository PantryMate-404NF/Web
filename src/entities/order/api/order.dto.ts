export type OrderStatus =
  'PENDING' | 'CONFIRMED' | 'FAILED' | 'UNKNOWN_HOLD' | 'CANCEL_REQUESTED' | 'CANCELLED';

export interface OrderCreateRequestDto {
  cartId: number;
  selectedCartItemIds: number[];
}

export interface OrderCreateResponseDto {
  orderId: string;
  totalAmount: number;
  name: string;
  status: OrderStatus;
  createdAt: string;
}
