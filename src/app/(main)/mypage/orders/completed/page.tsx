import { OrderHistoryPage } from '@/views/mypage/ui/order-history-page';

/** 주문 내역의 배송완료 상태에서 진입하는 완료 주문 목록입니다. */
export default function CompletedOrdersRoute() {
  return <OrderHistoryPage status="completed" />;
}
