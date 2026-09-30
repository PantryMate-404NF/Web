export const ORDER_LIST_QUERY_KEY = ['orders', 'list'] as const;
export const ORDER_DETAIL_QUERY_KEY = ['orders', 'detail'] as const;

export function getOrderListQueryKey(status?: string) {
  return [...ORDER_LIST_QUERY_KEY, status ?? 'ALL'] as const;
}

export function getOrderDetailQueryKey(orderId: string) {
  return [...ORDER_DETAIL_QUERY_KEY, orderId] as const;
}
