import { beforeEach, describe, expect, it, vi } from 'vitest';

const { invalidateQueriesMock, mutationOptions, useMutationMock, useQueryClientMock } = vi.hoisted(
  () => ({
    invalidateQueriesMock: vi.fn(),
    mutationOptions: [] as Array<Record<string, unknown>>,
    useMutationMock: vi.fn((options: Record<string, unknown>) => {
      mutationOptions.push(options);
      return { error: null, isPending: false, mutate: vi.fn() };
    }),
    useQueryClientMock: vi.fn(),
  }),
);

vi.mock('@tanstack/react-query', () => ({
  useMutation: useMutationMock,
  useQueryClient: useQueryClientMock,
}));

describe('useCartMutations', () => {
  beforeEach(() => {
    invalidateQueriesMock.mockReset();
    mutationOptions.length = 0;
    useMutationMock.mockClear();
    useQueryClientMock.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
      setQueryData: vi.fn(),
    });
  });

  it('삭제 요청이 정산되면 성공 여부와 관계없이 장바구니 조회를 무효화한다', async () => {
    const { useCartMutations } = await import('./use-cart-mutations');

    useCartMutations();
    const removeMutationOptions = mutationOptions[1];

    expect(removeMutationOptions).toBeDefined();
    await (removeMutationOptions.onSettled as () => Promise<void>)();

    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: ['cart', 'detail'] });
  });
});
