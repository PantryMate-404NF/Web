'use client';

import { useRouter } from 'next/navigation';

import { useAddressMutations } from '@/entities/address/api/use-address-mutations';
import { useAddressesQuery } from '@/entities/address/api/use-addresses-query';
import { useAuthSession } from '@/features/auth/ui/auth-session-provider';

import { AddressListPage } from './address-list-page';

export function AddressListRouteContent({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const { state: authState } = useAuthSession();
  const isAuthLoading = authState === 'loading';
  const shouldQuery = authState === 'complete' || authState === 'onboarding';
  const { data: addresses = [], error, isPending, refetch } = useAddressesQuery(shouldQuery);
  const { setDefault } = useAddressMutations();

  return (
    <AddressListPage
      addresses={addresses}
      errorMessage={error instanceof Error ? error.message : undefined}
      isLoading={isAuthLoading || (shouldQuery && isPending) || setDefault.isPending}
      isUnauthorized={!isAuthLoading && !shouldQuery}
      onRetry={() => {
        void refetch();
      }}
      onSelect={
        returnTo
          ? async (addressId) => {
              try {
                const selectedAddress = addresses.find((address) => address.id === addressId);
                if (!selectedAddress) return;
                if (!selectedAddress.isDefault) {
                  await setDefault.mutateAsync(Number(addressId));
                }
                router.push(returnTo);
              } catch {
                // Mutation error is rendered without replacing the address list.
              }
            }
          : undefined
      }
      returnTo={returnTo}
      selectionErrorMessage={
        setDefault.error instanceof Error ? setDefault.error.message : undefined
      }
    />
  );
}
