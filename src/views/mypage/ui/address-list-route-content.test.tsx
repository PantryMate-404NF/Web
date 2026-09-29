import { beforeEach, describe, expect, it, vi } from 'vitest';

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
  isDefault: false,
};

describe('AddressListRouteContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('이미 기본 배송지인 항목은 설정 API를 다시 호출하지 않고 주문서로 복귀한다', async () => {
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useAddressesQueryMock.mockReturnValue({
      data: [{ ...address, isDefault: true }],
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
    });

    const page = AddressListRouteContent({ returnTo: '/order?preview=local' });
    await page.props.onSelect('12');

    expect(setDefaultMutateAsyncMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/order?preview=local');
  });

  it('기본 배송지 설정 실패를 처리하고 목록 오류와 분리한다', async () => {
    const mutationError = new Error('기본 배송지를 설정하지 못했습니다.');
    setDefaultMutateAsyncMock.mockRejectedValueOnce(mutationError);
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useAddressesQueryMock.mockReturnValue({
      data: [address],
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useAddressMutationsMock.mockReturnValue({
      setDefault: {
        error: mutationError,
        isPending: false,
        mutateAsync: setDefaultMutateAsyncMock,
      },
    });

    const page = AddressListRouteContent({ returnTo: '/order' });

    expect(page.props.errorMessage).toBeUndefined();
    expect(page.props.selectionErrorMessage).toBe(mutationError.message);
    await expect(page.props.onSelect('12')).resolves.toBeUndefined();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
