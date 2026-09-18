import { redirect } from 'next/navigation';

import { getOrderHistoryMock } from '@/entities/order/model/mock';
import { OrderCancelCompletePage } from '@/views/mypage/ui/order-cancel-complete-page';

/** 취소 요청 완료 화면을 표시합니다. */
export default async function OrderCancelCompleteRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  if (!getOrderHistoryMock(orderId)) {
    redirect('/mypage/orders');
  }

  return <OrderCancelCompletePage orderId={orderId} />;
}
