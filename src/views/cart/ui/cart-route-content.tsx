'use client';

import { useState } from 'react';

import type { CartItem } from '@/entities/cart/model/cart-store';
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
  if (!shouldUseApi) return <CartPage isUnauthorized />;

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

export function CartPreviewRouteContent({ initialItems }: { initialItems: CartItem[] }) {
  const [items, setItems] = useState(initialItems);

  return (
    <CartPage
      items={items}
      onRemoveItems={(targetItems) => {
        const targetIds = new Set(targetItems.map((item) => item.id));
        setItems((currentItems) => currentItems.filter((item) => !targetIds.has(item.id)));
      }}
      onUpdateQuantity={(targetItem, quantity) => {
        setItems((currentItems) =>
          currentItems.map((item) => (item.id === targetItem.id ? { ...item, quantity } : item)),
        );
      }}
    />
  );
}
