'use client';

import type { CartItem } from '@/entities/cart/model/cart-store';
import { useCartQuery } from '@/views/cart/model/use-cart-query';

import { OrderPage } from './order-page';

interface OrderRouteContentProps {
  apiEnabled?: boolean;
  cartId?: number;
  previewItems?: CartItem[];
  selectedItemIds: string[];
}

export function OrderRouteContent({
  apiEnabled = Boolean(process.env.NEXT_PUBLIC_ORDER_PAYMENT_TEST_USER_ID),
  previewItems,
  selectedItemIds,
}: OrderRouteContentProps) {
  const shouldQuery = apiEnabled && !previewItems;
  const { data, error, isPending, refetch } = useCartQuery(shouldQuery);

  if (previewItems) {
    return <OrderPage items={previewItems} selectedItemIds={selectedItemIds} />;
  }

  if (!apiEnabled) return <OrderPage selectedItemIds={selectedItemIds} />;

  return (
    <OrderPage
      cartId={data?.cartId}
      errorMessage={error instanceof Error ? error.message : undefined}
      isLoading={isPending}
      items={data?.items ?? []}
      onRetry={() => {
        void refetch();
      }}
      selectedItemIds={selectedItemIds}
    />
  );
}
