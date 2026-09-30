'use client';

import type { CartItem } from '@/entities/cart/model/cart-store';
import { useDefaultAddressQuery } from '@/entities/address/api/use-default-address-query';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { useCartQuery } from '@/entities/cart/api/use-cart-query';
import { useMyProfileQuery } from '@/entities/user/api/use-my-profile-query';

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
  const shouldQueryCart = shouldUseApi && !previewItems && !localPreview;
  const shouldQueryAddress = shouldUseApi;
  const { data, error, isPending, refetch } = useCartQuery(shouldQueryCart);
  const {
    data: profile,
    error: profileError,
    isPending: isProfilePending,
  } = useMyProfileQuery(shouldUseApi);
  const {
    data: defaultAddress,
    error: addressError,
    isPending: isAddressPending,
    refetch: refetchAddress,
  } = useDefaultAddressQuery(shouldQueryAddress);
  const isAddressLoading = shouldQueryAddress && isAddressPending;

  if (localPreview) {
    return (
      <OrderPage
        defaultAddress={defaultAddress ?? undefined}
        errorMessage={addressError instanceof Error ? addressError.message : undefined}
        isLoading={isAuthLoading || isAddressLoading}
        orderer={profile}
        ordererErrorMessage={profileError instanceof Error ? profileError.message : undefined}
        ordererLoading={shouldUseApi && isProfilePending}
        onRetry={() => {
          void refetchAddress();
        }}
        orderReturnTo={orderReturnTo}
        paymentDisabled
        selectedItemIds={selectedItemIds}
      />
    );
  }

  if (previewItems) {
    return (
      <OrderPage
        defaultAddress={defaultAddress ?? undefined}
        errorMessage={addressError instanceof Error ? addressError.message : undefined}
        isLoading={isAuthLoading || isAddressLoading}
        items={previewItems}
        orderer={profile}
        ordererErrorMessage={profileError instanceof Error ? profileError.message : undefined}
        ordererLoading={shouldUseApi && isProfilePending}
        onRetry={() => {
          void refetchAddress();
        }}
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
      isLoading={isPending || isAddressLoading}
      items={data?.items ?? []}
      orderer={profile}
      ordererErrorMessage={profileError instanceof Error ? profileError.message : undefined}
      ordererLoading={isProfilePending}
      orderReturnTo={orderReturnTo}
      onRetry={() => {
        void Promise.all([refetch(), refetchAddress()]);
      }}
      selectedItemIds={selectedItemIds}
    />
  );
}
