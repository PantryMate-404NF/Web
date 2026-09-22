import { create } from 'zustand';

import { addDeliveryAddress, deliveryAddressMocks, type DeliveryAddress } from './address';

type AddressState = {
  addresses: DeliveryAddress[];
  selectedAddressId?: string;
  addAddress: (address: DeliveryAddress) => void;
  selectAddress: (addressId: string) => void;
};

export const useAddressStore = create<AddressState>((set) => ({
  addresses: [...deliveryAddressMocks],
  selectedAddressId: deliveryAddressMocks.find((address) => address.isDefault)?.id,
  addAddress: (address) =>
    set((state) => ({
      addresses: addDeliveryAddress(state.addresses, address),
      selectedAddressId: address.isDefault ? address.id : state.selectedAddressId,
    })),
  selectAddress: (addressId) => set({ selectedAddressId: addressId }),
}));

export const selectAddresses = (state: AddressState) => state.addresses;
export const selectSelectedAddress = (state: AddressState) =>
  state.addresses.find((address) => address.id === state.selectedAddressId) ??
  state.addresses.find((address) => address.isDefault) ??
  state.addresses[0];
