import { OrderCancelPage } from '@/views/mypage/ui/order-cancel-page';

/** 주문 취소 사유 선택 화면을 표시합니다. */
export default async function OrderCancelRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <OrderCancelPage orderId={orderId} />;
}
