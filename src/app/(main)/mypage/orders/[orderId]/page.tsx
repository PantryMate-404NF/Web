import { redirect } from 'next/navigation';

import { getOrderHistoryMock } from '@/entities/order/model/mock';
import { OrderDetailPage } from '@/views/mypage/ui/order-detail-page';

/** 주문 식별자에 해당하는 상세 화면을 표시합니다. */
export default async function OrderDetailRoute({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  if (!getOrderHistoryMock(orderId)) {
    redirect('/mypage/orders');
  }

  return <OrderDetailPage orderId={orderId} />;
}
