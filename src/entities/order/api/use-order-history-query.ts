import { useQueries, useQuery } from '@tanstack/react-query';

import { toOrderHistoryRecord } from '@/entities/order/model/order-history';
import { getOrderDetailQueryKey, getOrderListQueryKey } from '@/entities/order/model/query-key';

import { getOrderDetail } from './get-order-detail';
import { getOrders } from './get-orders';
import type { OrderStatus } from './order.dto';

export function useOrderHistoryQuery(status?: OrderStatus, enabled = true) {
  const orderListQuery = useQuery({
    enabled,
    queryKey: getOrderListQueryKey(status),
    queryFn: () => getOrders({ status, page: 0, size: 20 }),
  });
  const summaries = orderListQuery.data?.content ?? [];
  const detailQueries = useQueries({
    queries: summaries.map(({ orderId }) => ({
      queryKey: getOrderDetailQueryKey(orderId),
      queryFn: () => getOrderDetail(orderId),
    })),
  });

  const detailError = detailQueries.find((query) => query.isError)?.error;
  const hasInvalidDetailResponse = detailQueries.some((query) => query.isSuccess && !query.data);
  const isError =
    orderListQuery.isError ||
    detailQueries.some((query) => query.isError) ||
    hasInvalidDetailResponse;
  const isPending =
    !isError && (orderListQuery.isPending || detailQueries.some((query) => query.isPending));
  const data =
    !isPending && !isError && orderListQuery.data
      ? summaries.map((summary, index) => toOrderHistoryRecord(summary, detailQueries[index].data!))
      : undefined;

  return {
    data,
    error:
      orderListQuery.error ??
      detailError ??
      (hasInvalidDetailResponse ? new Error('주문 상세 응답이 비어 있습니다.') : null),
    isError,
    isPending,
    refetch: async () => {
      const results = await Promise.all([
        orderListQuery.refetch(),
        ...detailQueries.map((query) => query.refetch()),
      ]);

      return results.some((result) => result.isError);
    },
  };
}
