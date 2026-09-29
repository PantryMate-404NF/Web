export interface UserAddressDto {
  addressId: number;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address: string;
  addressDetail?: string | null;
  isDefault: boolean;
}

export interface UserAddressCreateRequestDto {
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
}

export type UserAddressUpdateRequestDto = Omit<UserAddressCreateRequestDto, 'isDefault'>;
