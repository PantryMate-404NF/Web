import { describe, expect, it, vi } from 'vitest';

import { AddressListRouteContent } from './address-list-route-content';

const {
  pushMock,
  setDefaultMutateAsyncMock,
  useAddressMutationsMock,
  useAddressesQueryMock,
  useAuthSessionMock,
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  setDefaultMutateAsyncMock: vi.fn(),
  useAddressMutationsMock: vi.fn(),
  useAddressesQueryMock: vi.fn(),
  useAuthSessionMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }));
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
  isDefault: true,
};

describe('AddressListRouteContent', () => {
  it('주문서에서 배송지를 선택하면 서버 기본 배송지를 바꾼 뒤 복귀한다', async () => {
    const refetch = vi.fn();
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useAddressesQueryMock.mockReturnValue({
      data: [address],
      error: null,
      isPending: false,
      refetch,
    });
    useAddressMutationsMock.mockReturnValue({
      setDefault: {
        error: null,
        isPending: false,
        mutateAsync: setDefaultMutateAsyncMock,
      },
    });

    const page = AddressListRouteContent({ returnTo: '/order' });

    expect(useAddressesQueryMock).toHaveBeenCalledWith(true);
    expect(page.props).toMatchObject({ addresses: [address], isLoading: false });
    await page.props.onSelect('12');
    expect(setDefaultMutateAsyncMock).toHaveBeenCalledWith(12);
    expect(pushMock).toHaveBeenCalledWith('/order');
    page.props.onRetry();
    expect(refetch).toHaveBeenCalledOnce();
  });

  it('비로그인 상태에서는 API를 호출하지 않고 로그인 안내를 전달한다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'guest' });
    useAddressesQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });
    useAddressMutationsMock.mockReturnValue({
      setDefault: { error: null, isPending: false, mutateAsync: setDefaultMutateAsyncMock },
    });

    const page = AddressListRouteContent({});

    expect(useAddressesQueryMock).toHaveBeenCalledWith(false);
    expect(page.props).toMatchObject({ isUnauthorized: true });
  });
});
