/** 주문 내역의 배송조회 버튼에서 진입하는 배송 상세 라우트입니다. */
import { DeliveryTrackingPage } from '@/views/mypage/ui/delivery-tracking-page';

export default async function DeliveryTrackingRoute({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string | string[]; preparing?: string | string[] }>;
}) {
  const params = await searchParams;
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const preparingOrderId = Array.isArray(params.preparing) ? params.preparing[0] : params.preparing;

  return <DeliveryTrackingPage orderId={orderId} preparingOrderId={preparingOrderId} />;
}
