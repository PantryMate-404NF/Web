import { describe, expect, it, vi } from 'vitest';

import { AddressEditRouteContent } from './address-edit-route-content';

const {
  setDefaultMutateAsyncMock,
  updateMutateAsyncMock,
  useAddressMutationsMock,
  useAddressesQueryMock,
  useAuthSessionMock,
} = vi.hoisted(() => ({
  setDefaultMutateAsyncMock: vi.fn(),
  updateMutateAsyncMock: vi.fn(),
  useAddressMutationsMock: vi.fn(),
  useAddressesQueryMock: vi.fn(),
  useAuthSessionMock: vi.fn(),
}));

vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('@/entities/address/api/use-addresses-query', () => ({
  useAddressesQuery: useAddressesQueryMock,
}));
vi.mock('@/entities/address/api/use-address-mutations', () => ({
  useAddressMutations: useAddressMutationsMock,
}));

const address = {
  id: '12',
  recipientName: '김지웅',
  phoneNumber: '01012345678',
  addressLine1: '경기도 성남시 분당구 불정로 90',
  addressLine2: '101동 1001호',
  postalCode: '13485',
  isDefault: false,
};

describe('AddressEditRouteContent', () => {
  it('선택한 배송지를 수정하고 기본 배송지로 설정한다', async () => {
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useAddressesQueryMock.mockReturnValue({
      data: [address],
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useAddressMutationsMock.mockReturnValue({
      setDefault: {
        error: null,
        isPending: false,
        mutateAsync: setDefaultMutateAsyncMock,
      },
      update: { error: null, isPending: false, mutateAsync: updateMutateAsyncMock },
    });

    const page = AddressEditRouteContent({ addressId: '12' });
    await page.props.onSubmit({ ...address, isDefault: true });

    expect(updateMutateAsyncMock).toHaveBeenCalledWith({
      addressId: 12,
      payload: {
        recipientName: '김지웅',
        recipientPhone: '01012345678',
        zipCode: '13485',
        address: '경기도 성남시 분당구 불정로 90',
        addressDetail: '101동 1001호',
      },
    });
    expect(setDefaultMutateAsyncMock).toHaveBeenCalledWith(12);
  });
});
