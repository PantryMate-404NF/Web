'use client';

import type { CartItem } from '@/entities/cart/model/cart-store';
import { useDefaultAddressQuery } from '@/entities/address/api/use-default-address-query';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { useCartQuery } from '@/views/cart/model/use-cart-query';

import { OrderPage } from './order-page';

interface OrderRouteContentProps {
  apiEnabled?: boolean;
  cartId?: number;
  localPreview?: boolean;
  orderReturnTo?: string;
  previewItems?: CartItem[];
  selectedItemIds: string[];
}

export function OrderRouteContent({
  apiEnabled,
  localPreview = false,
  orderReturnTo = '/order',
  previewItems,
  selectedItemIds,
}: OrderRouteContentProps) {
  const { state: authState } = useAuthSession();
  const isAuthLoading = apiEnabled === undefined && authState === 'loading';
  const shouldUseApi = apiEnabled ?? (authState === 'complete' || authState === 'onboarding');
  const shouldQuery = shouldUseApi && !previewItems && !localPreview;
  const { data, error, isPending, refetch } = useCartQuery(shouldQuery);
  const {
    data: defaultAddress,
    error: addressError,
    isPending: isAddressPending,
    refetch: refetchAddress,
  } = useDefaultAddressQuery(shouldQuery);

  if (localPreview) {
    return (
      <OrderPage orderReturnTo={orderReturnTo} paymentDisabled selectedItemIds={selectedItemIds} />
    );
  }

  if (previewItems) {
    return (
      <OrderPage
        defaultAddress={defaultAddress ?? undefined}
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
        defaultAddress={defaultAddress ?? undefined}
        errorMessage="로그인 후 주문서를 이용해 주세요."
        orderReturnTo={orderReturnTo}
        selectedItemIds={selectedItemIds}
      />
    );
  }

  return (
    <OrderPage
      cartId={data?.cartId}
      defaultAddress={defaultAddress ?? undefined}
      errorMessage={
        error instanceof Error
          ? error.message
          : addressError instanceof Error
            ? addressError.message
            : undefined
      }
      isLoading={isPending || isAddressPending}
      items={data?.items ?? []}
      orderReturnTo={orderReturnTo}
      onRetry={() => {
        void Promise.all([refetch(), refetchAddress()]);
      }}
      selectedItemIds={selectedItemIds}
    />
  );
}
