import { OrderCancelCompletePage } from '@/views/mypage/ui/order-cancel-complete-page';

/** 취소 요청 완료 화면을 표시합니다. */
export default async function OrderCancelCompleteRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <OrderCancelCompletePage orderId={orderId} />;
}
