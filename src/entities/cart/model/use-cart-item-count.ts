'use client';

import { useCartQuery } from '@/entities/cart/api/use-cart-query';
import { getCartItemCount, useCartStore } from '@/entities/cart/model/cart-store';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';
import { CART_WRITE_MODE } from '@/shared/config/cart-write-mode';

export function useCartItemCount() {
  const { state: authState } = useAuthSession();
  const previewCartItems = useCartStore((state) => state.items);
  const isServerCartMode = CART_WRITE_MODE === 'api' || CART_WRITE_MODE === 'mock-api';
  const canQueryServerCart =
    isServerCartMode && (authState === 'complete' || authState === 'onboarding');
  const serverCartQuery = useCartQuery(canQueryServerCart);

  return isServerCartMode
    ? getCartItemCount(canQueryServerCart ? (serverCartQuery.data?.items ?? []) : [])
    : getCartItemCount(previewCartItems);
}
