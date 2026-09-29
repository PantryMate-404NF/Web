import { useQuery } from '@tanstack/react-query';

import { getDefaultAddress } from './get-default-address';
import { toDeliveryAddress } from './address.mapper';

export const DEFAULT_ADDRESS_QUERY_KEY = ['user', 'addresses', 'default'] as const;

export function useDefaultAddressQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getDefaultAddress,
    queryKey: DEFAULT_ADDRESS_QUERY_KEY,
    select: (address) => (address ? toDeliveryAddress(address) : null),
  });
}
