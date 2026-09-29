'use client';

import { toUserAddressUpdateRequest } from '@/entities/address/api/address.mapper';
import { useAddressMutations } from '@/entities/address/api/use-address-mutations';
import { useAddressesQuery } from '@/entities/address/api/use-addresses-query';
import type { DeliveryAddressInput } from '@/entities/address/model/address';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';

import { AddressFormPage } from './address-form-page';

function parseAddressId(addressId: string) {
  const parsedAddressId = Number(addressId);
  return Number.isSafeInteger(parsedAddressId) && parsedAddressId > 0 ? parsedAddressId : undefined;
}

export function AddressEditRouteContent({
  addressId,
  returnTo,
}: {
  addressId: string;
  returnTo?: string;
}) {
  const { state: authState } = useAuthSession();
  const isAuthLoading = authState === 'loading';
  const isAuthorized = authState === 'complete' || authState === 'onboarding';
  const { data: addresses = [], error, isPending } = useAddressesQuery(isAuthorized);
  const mutations = useAddressMutations();
  const numericAddressId = parseAddressId(addressId);
  const address = addresses.find((item) => item.id === addressId);
  const mutationError = mutations.update.error ?? mutations.setDefault.error;
  const isMutating = mutations.update.isPending || mutations.setDefault.isPending;

  return (
    <AddressFormPage
      errorMessage={
        (error instanceof Error ? error.message : undefined) ??
        (mutationError instanceof Error ? mutationError.message : undefined)
      }
      initialAddress={address}
      isLoading={isAuthLoading || (isAuthorized && isPending)}
      isSubmitting={isMutating}
      isUnauthorized={!isAuthLoading && !isAuthorized}
      isUnavailable={isAuthorized && !isPending && (!numericAddressId || !address)}
      key={address?.id ?? 'pending-address'}
      onSubmit={async (input: DeliveryAddressInput) => {
        if (!numericAddressId) return;
        await mutations.update.mutateAsync({
          addressId: numericAddressId,
          payload: toUserAddressUpdateRequest(input),
        });
        if (input.isDefault && !address?.isDefault) {
          await mutations.setDefault.mutateAsync(numericAddressId);
        }
      }}
      returnTo={returnTo}
    />
  );
}
