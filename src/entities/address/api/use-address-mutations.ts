import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAddress } from './create-address';
import type { UserAddressDto } from './address.dto';
import { setDefaultAddress } from './set-default-address';
import { updateAddress } from './update-address';
import { ADDRESS_QUERY_KEY } from './use-addresses-query';
import { DEFAULT_ADDRESS_QUERY_KEY } from './use-default-address-query';

export { ADDRESS_QUERY_KEY, DEFAULT_ADDRESS_QUERY_KEY };

export function useAddressMutations() {
  const queryClient = useQueryClient();
  const invalidateAddresses = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: DEFAULT_ADDRESS_QUERY_KEY }),
    ]);
  };

  return {
    create: useMutation({ mutationFn: createAddress, onSuccess: invalidateAddresses }),
    update: useMutation({
      mutationFn: ({
        addressId,
        payload,
      }: {
        addressId: number;
        payload: Parameters<typeof updateAddress>[1];
      }) => updateAddress(addressId, payload),
      onSuccess: invalidateAddresses,
    }),
    setDefault: useMutation({
      mutationFn: setDefaultAddress,
      onSuccess: (selectedAddress) => {
        queryClient.setQueryData(DEFAULT_ADDRESS_QUERY_KEY, selectedAddress);
        queryClient.setQueryData<UserAddressDto[]>(ADDRESS_QUERY_KEY, (addresses) =>
          addresses?.map((address) => ({
            ...address,
            isDefault: address.addressId === selectedAddress.addressId,
          })),
        );
      },
    }),
  };
}
