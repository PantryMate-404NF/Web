export type OrderStatus =
  'PENDING' | 'CONFIRMED' | 'FAILED' | 'UNKNOWN_HOLD' | 'CANCEL_REQUESTED' | 'CANCELLED';

export interface OrderSummaryDto {
  orderId: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  representativeProductName: string;
}

export interface OrderListResponseDto {
  content: OrderSummaryDto[];
  totalElements: number;
  totalPages: number;
}

export interface OrderDetailDto {
  orderId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    productId?: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
    thumbnailUrl?: string | null;
  }>;
  payment: {
    method: string;
    status: string;
    approvedAt: string | null;
  } | null;
  availableActions: string[];
}

export interface OrderCreateRequestDto {
  cartId: number;
  selectedCartItemIds: number[];
  deliveryAddress: DeliveryAddressRequestDto;
}

export interface DeliveryAddressRequestDto {
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
}

export interface OrderCreateResponseDto {
  orderId: string;
  totalAmount: number;
  name: string;
  status: OrderStatus;
  createdAt: string;
}
