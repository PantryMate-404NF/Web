import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  invalidateQueriesMock,
  mutationOptions,
  setQueryDataMock,
  useMutationMock,
  useQueryClientMock,
} = vi.hoisted(() => ({
  invalidateQueriesMock: vi.fn(),
  mutationOptions: [] as Array<Record<string, unknown>>,
  setQueryDataMock: vi.fn(),
  useMutationMock: vi.fn((options: Record<string, unknown>) => {
    mutationOptions.push(options);
    return { error: null, isPending: false, mutate: vi.fn(), mutateAsync: vi.fn() };
  }),
  useQueryClientMock: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: useMutationMock,
  useQueryClient: useQueryClientMock,
}));

describe('useAddressMutations', () => {
  beforeEach(() => {
    invalidateQueriesMock.mockReset();
    setQueryDataMock.mockReset();
    mutationOptions.length = 0;
    useMutationMock.mockClear();
    useQueryClientMock.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
      setQueryData: setQueryDataMock,
    });
  });

  it('배송지 변경 성공 후 목록과 기본 배송지 캐시를 갱신한다', async () => {
    const { ADDRESS_QUERY_KEY, DEFAULT_ADDRESS_QUERY_KEY, useAddressMutations } =
      await import('./use-address-mutations');

    useAddressMutations();
    await Promise.all(
      mutationOptions.slice(0, 2).map((options) => (options.onSuccess as () => Promise<void>)()),
    );

    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ADDRESS_QUERY_KEY });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: DEFAULT_ADDRESS_QUERY_KEY });
  });

  it('기본 배송지 설정 성공 응답을 목록과 기본 배송지 캐시에 즉시 반영한다', async () => {
    const { ADDRESS_QUERY_KEY, DEFAULT_ADDRESS_QUERY_KEY, useAddressMutations } =
      await import('./use-address-mutations');
    const selectedAddress = {
      addressId: 12,
      recipientName: '김지웅',
      recipientPhone: '01012345678',
      zipCode: '13485',
      address: '경기도 성남시 분당구 불정로 90',
      addressDetail: '101동 1001호',
      isDefault: true,
    };

    useAddressMutations();
    await (mutationOptions[2].onSuccess as (address: typeof selectedAddress) => Promise<void>)(
      selectedAddress,
    );

    expect(setQueryDataMock).toHaveBeenCalledWith(DEFAULT_ADDRESS_QUERY_KEY, selectedAddress);
    expect(setQueryDataMock).toHaveBeenCalledWith(ADDRESS_QUERY_KEY, expect.any(Function));

    const updateAddressList = setQueryDataMock.mock.calls.find(
      ([queryKey]) => queryKey === ADDRESS_QUERY_KEY,
    )?.[1] as (addresses: (typeof selectedAddress)[]) => (typeof selectedAddress)[];
    const updatedAddresses = updateAddressList([
      { ...selectedAddress, isDefault: false },
      { ...selectedAddress, addressId: 13, isDefault: true },
    ]);

    expect(updatedAddresses).toEqual([
      { ...selectedAddress, isDefault: true },
      { ...selectedAddress, addressId: 13, isDefault: false },
    ]);
  });
});
