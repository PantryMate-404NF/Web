'use client';

import { useCartQuery } from '../model/use-cart-query';
import { useCartMutations } from '../model/use-cart-mutations';
import { CartPage } from './cart-page';

export function CartRouteContent({
  apiEnabled = Boolean(process.env.NEXT_PUBLIC_ORDER_PAYMENT_TEST_USER_ID),
}: {
  apiEnabled?: boolean;
}) {
  const { data, error, isPending, refetch } = useCartQuery(apiEnabled);
  const cartMutations = useCartMutations();

  if (!apiEnabled) return <CartPage />;

  return (
    <CartPage
      cartId={data?.cartId}
      errorMessage={error instanceof Error ? error.message : undefined}
      isLoading={isPending}
      isMutating={cartMutations.isPending}
      items={data?.items ?? []}
      mutationErrorMessage={
        cartMutations.error instanceof Error ? cartMutations.error.message : undefined
      }
      onRemoveItems={cartMutations.removeItems}
      onRetry={() => {
        void refetch();
      }}
      onUpdateQuantity={cartMutations.updateQuantity}
    />
  );
}
