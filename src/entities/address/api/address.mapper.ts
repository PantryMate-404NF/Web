import type { DeliveryAddress, DeliveryAddressInput } from '../model/address';
import type {
  UserAddressCreateRequestDto,
  UserAddressDto,
  UserAddressUpdateRequestDto,
} from './address.dto';

export function toDeliveryAddress(address: UserAddressDto): DeliveryAddress {
  return {
    id: String(address.addressId),
    recipientName: address.recipientName,
    phoneNumber: address.recipientPhone,
    postalCode: address.zipCode,
    addressLine1: address.address,
    addressLine2: address.addressDetail ?? '',
    isDefault: address.isDefault,
  };
}

export function toUserAddressRequest(address: DeliveryAddressInput): UserAddressCreateRequestDto {
  return {
    recipientName: address.recipientName,
    recipientPhone: address.phoneNumber,
    zipCode: address.postalCode,
    address: address.addressLine1,
    addressDetail: address.addressLine2,
    isDefault: address.isDefault,
  };
}

export function toUserAddressUpdateRequest(
  address: DeliveryAddressInput,
): UserAddressUpdateRequestDto {
  return {
    recipientName: address.recipientName,
    recipientPhone: address.phoneNumber,
    zipCode: address.postalCode,
    address: address.addressLine1,
    addressDetail: address.addressLine2,
  };
}
