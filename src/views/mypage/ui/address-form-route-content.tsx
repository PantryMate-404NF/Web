'use client';

import { toUserAddressRequest } from '@/entities/address/api/address.mapper';
import { useAddressMutations } from '@/entities/address/api/use-address-mutations';
import type { DeliveryAddressInput } from '@/entities/address/model/address';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';

import { AddressFormPage } from './address-form-page';

export function AddressFormRouteContent({ returnTo }: { returnTo?: string }) {
  const { state: authState } = useAuthSession();
  const { create } = useAddressMutations();
  const isAuthLoading = authState === 'loading';
  const isAuthorized = authState === 'complete' || authState === 'onboarding';

  return (
    <AddressFormPage
      errorMessage={create.error instanceof Error ? create.error.message : undefined}
      isLoading={isAuthLoading}
      isSubmitting={create.isPending}
      isUnauthorized={!isAuthLoading && !isAuthorized}
      onSubmit={(input: DeliveryAddressInput) => create.mutateAsync(toUserAddressRequest(input))}
      returnTo={returnTo}
    />
  );
}
