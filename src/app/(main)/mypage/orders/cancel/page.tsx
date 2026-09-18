import { ORDER_HISTORY_MOCK } from '@/entities/order/model/mock';
import { OrderDetailPage } from '@/views/mypage/ui/order-cancel-list-page';

/** 취소·환불 신청 내역 화면을 표시합니다. */
export default function OrderCancelListRoute() {
  return <OrderDetailPage orderId={ORDER_HISTORY_MOCK.id} />;
}
