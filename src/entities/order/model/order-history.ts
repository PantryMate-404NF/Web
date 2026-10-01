import type { OrderDetailDto, OrderStatus, OrderSummaryDto } from '../api/order.dto';

const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: '결제 대기',
  CONFIRMED: '결제 완료',
  FAILED: '결제 실패',
  UNKNOWN_HOLD: '결제 확인 중',
  CANCEL_REQUESTED: '취소 처리 중',
  CANCELLED: '취소 완료',
};

export interface OrderHistoryRecord {
  id: string;
  orderedAt: string;
  orderNumber: string;
  paymentAmount: number;
  status: OrderStatus;
  statusLabel: string;
  items: Array<{
    id: string;
    productId?: number;
    name: string;
    price: number;
    quantity: number;
    thumbnailUrl?: string | null;
  }>;
}

export function formatOrderDate(dateTime: string) {
  const [year, month, day] = dateTime.slice(0, 10).split('-');
  return year && month && day ? `${year}.${month}.${day}` : dateTime;
}

export function toOrderHistoryRecord(
  summary: OrderSummaryDto,
  detail: OrderDetailDto,
): OrderHistoryRecord {
  return {
    id: summary.orderId,
    orderedAt: formatOrderDate(detail.createdAt),
    orderNumber: detail.orderId,
    paymentAmount: detail.totalAmount,
    status: detail.status,
    statusLabel: orderStatusLabels[detail.status],
    items: detail.items.map((item, index) => ({
      id: `${detail.orderId}-${index}`,
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      thumbnailUrl: item.thumbnailUrl,
    })),
  };
}

export function getOrderStatusLabel(status: OrderStatus) {
  return orderStatusLabels[status];
}
