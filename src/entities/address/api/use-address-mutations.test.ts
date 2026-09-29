import { beforeEach, describe, expect, it, vi } from 'vitest';

const { invalidateQueriesMock, mutationOptions, useMutationMock, useQueryClientMock } = vi.hoisted(
  () => ({
    invalidateQueriesMock: vi.fn(),
    mutationOptions: [] as Array<Record<string, unknown>>,
    useMutationMock: vi.fn((options: Record<string, unknown>) => {
      mutationOptions.push(options);
      return { error: null, isPending: false, mutate: vi.fn(), mutateAsync: vi.fn() };
    }),
    useQueryClientMock: vi.fn(),
  }),
);

vi.mock('@tanstack/react-query', () => ({
  useMutation: useMutationMock,
  useQueryClient: useQueryClientMock,
}));

describe('useAddressMutations', () => {
  beforeEach(() => {
    invalidateQueriesMock.mockReset();
    mutationOptions.length = 0;
    useMutationMock.mockClear();
    useQueryClientMock.mockReturnValue({ invalidateQueries: invalidateQueriesMock });
  });

  it('배송지 변경 성공 후 목록과 기본 배송지 캐시를 갱신한다', async () => {
    const { ADDRESS_QUERY_KEY, DEFAULT_ADDRESS_QUERY_KEY, useAddressMutations } =
      await import('./use-address-mutations');

    useAddressMutations();
    await Promise.all(
      mutationOptions.map((options) => (options.onSuccess as () => Promise<void>)()),
    );

    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ADDRESS_QUERY_KEY });
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: DEFAULT_ADDRESS_QUERY_KEY });
  });
});
