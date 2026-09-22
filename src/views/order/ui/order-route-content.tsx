'use client';

import type { CartItem } from '@/entities/cart/model/cart-store';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { useCartQuery } from '@/views/cart/model/use-cart-query';

import { OrderPage } from './order-page';

interface OrderRouteContentProps {
  apiEnabled?: boolean;
  cartId?: number;
  orderReturnTo?: string;
  previewItems?: CartItem[];
  selectedItemIds: string[];
}

export function OrderRouteContent({
  apiEnabled,
  orderReturnTo = '/order',
  previewItems,
  selectedItemIds,
}: OrderRouteContentProps) {
  const { state: authState } = useAuthSession();
  const isAuthLoading = apiEnabled === undefined && authState === 'loading';
  const shouldUseApi = apiEnabled ?? (authState === 'complete' || authState === 'onboarding');
  const shouldQuery = shouldUseApi && !previewItems;
  const { data, error, isPending, refetch } = useCartQuery(shouldQuery);

  if (previewItems) {
    return (
      <OrderPage
        items={previewItems}
        orderReturnTo={orderReturnTo}
        selectedItemIds={selectedItemIds}
      />
    );
  }

  if (isAuthLoading)
    return <OrderPage isLoading orderReturnTo={orderReturnTo} selectedItemIds={selectedItemIds} />;
  if (!shouldUseApi) {
    return (
      <OrderPage
        errorMessage="로그인 후 주문서를 이용해 주세요."
        orderReturnTo={orderReturnTo}
        selectedItemIds={selectedItemIds}
      />
    );
  }

  return (
    <OrderPage
      cartId={data?.cartId}
      errorMessage={error instanceof Error ? error.message : undefined}
      isLoading={isPending}
      items={data?.items ?? []}
      orderReturnTo={orderReturnTo}
      onRetry={() => {
        void refetch();
      }}
      selectedItemIds={selectedItemIds}
    />
  );
}
