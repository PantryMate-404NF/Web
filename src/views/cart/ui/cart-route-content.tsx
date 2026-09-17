'use client';

import { useCartQuery } from '../model/use-cart-query';
import { CartPage } from './cart-page';

export function CartRouteContent({
  apiEnabled = Boolean(process.env.NEXT_PUBLIC_ORDER_PAYMENT_TEST_USER_ID),
}: {
  apiEnabled?: boolean;
}) {
  const { data, error, isPending, refetch } = useCartQuery(apiEnabled);

  if (!apiEnabled) return <CartPage />;

  return (
    <CartPage
      cartId={data?.cartId}
      errorMessage={error instanceof Error ? error.message : undefined}
      isLoading={isPending}
      items={data?.items ?? []}
      onRetry={() => {
        void refetch();
      }}
    />
  );
}
