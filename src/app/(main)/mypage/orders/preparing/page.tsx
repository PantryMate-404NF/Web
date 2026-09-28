import { OrderHistoryPage } from '@/views/mypage/ui/order-history-page';

/** 주문 내역의 배송준비 상태에서 진입하는 준비 중 주문 목록입니다. */
export default function PreparingOrdersRoute() {
  return <OrderHistoryPage status="preparing" />;
}
