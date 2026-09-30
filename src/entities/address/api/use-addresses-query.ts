import { useQuery } from '@tanstack/react-query';

import { getAddresses } from './get-addresses';
import { toDeliveryAddress } from './address.mapper';

export const ADDRESS_QUERY_KEY = ['user', 'addresses'] as const;

export function useAddressesQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getAddresses,
    queryKey: ADDRESS_QUERY_KEY,
    select: (addresses) => addresses.map(toDeliveryAddress),
  });
}
