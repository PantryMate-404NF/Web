'use client';

import { useAuthSession } from '@/features/auth/ui/auth-session-provider';

import { useCartQuery } from '../model/use-cart-query';
import { useCartMutations } from '../model/use-cart-mutations';
import { CartPage } from './cart-page';

export function CartRouteContent({ apiEnabled }: { apiEnabled?: boolean } = {}) {
  const { state: authState } = useAuthSession();
  const isAuthLoading = apiEnabled === undefined && authState === 'loading';
  const shouldUseApi = apiEnabled ?? (authState === 'complete' || authState === 'onboarding');
  const { data, error, isPending, refetch } = useCartQuery(shouldUseApi);
  const cartMutations = useCartMutations();

  if (isAuthLoading) return <CartPage isLoading />;
  if (!shouldUseApi) return <CartPage errorMessage="로그인 후 장바구니를 이용해 주세요." />;

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
