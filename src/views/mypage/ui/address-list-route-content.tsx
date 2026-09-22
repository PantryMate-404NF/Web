'use client';

import { useAddressStore } from '@/entities/address/model/address-store';

import { AddressListPage } from './address-list-page';

export function AddressListRouteContent({ returnTo }: { returnTo?: string }) {
  const addresses = useAddressStore((state) => state.addresses);
  const selectAddress = useAddressStore((state) => state.selectAddress);

  return <AddressListPage addresses={addresses} onSelect={selectAddress} returnTo={returnTo} />;
}
