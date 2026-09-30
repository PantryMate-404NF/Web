import { useQuery } from '@tanstack/react-query';

import { getOrderDetailQueryKey } from '@/entities/order/model/query-key';

import { getOrderDetail } from './get-order-detail';

export function useOrderDetailQuery(orderId: string) {
  return useQuery({
    enabled: Boolean(orderId),
    queryKey: getOrderDetailQueryKey(orderId),
    queryFn: () => getOrderDetail(orderId),
  });
}
