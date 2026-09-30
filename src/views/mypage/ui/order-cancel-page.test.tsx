import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useOrderDetailQueryMock = vi.hoisted(() => vi.fn());
const useMutationMock = vi.hoisted(() => vi.fn());
const useQueryClientMock = vi.hoisted(() => vi.fn());
const routerPushMock = vi.hoisted(() => vi.fn());
const cancelOrderMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/order/api/use-order-detail-query', () => ({
  useOrderDetailQuery: useOrderDetailQueryMock,
}));

vi.mock('@/entities/order/api/cancel-order', () => ({
  cancelOrder: cancelOrderMock,
}));

vi.mock('@tanstack/react-query', () => ({
  useMutation: useMutationMock,
  useQueryClient: useQueryClientMock,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock }),
}));

import {
  getAgreementCheckClassName,
  getCancellationReasonBorderColor,
  getCancellationReasonRadioClasses,
  OrderCancelPage,
} from './order-cancel-page';

const orderDetail = {
  orderId: 'ORDER_1',
  status: 'CONFIRMED',
  totalAmount: 15000,
  createdAt: '2026-09-30T17:00:00Z',
  items: [{ productName: '국내산 대파 1단', price: 3000, quantity: 2, subtotal: 6000 }],
  payment: { method: '카드', status: 'DONE', approvedAt: '2026-09-30T17:00:03Z' },
  availableActions: ['CANCEL'],
};

describe('OrderCancelPage', () => {
  const invalidateQueriesMock = vi.fn();

  beforeEach(() => {
    invalidateQueriesMock.mockReset().mockResolvedValue(undefined);
    routerPushMock.mockReset();
    cancelOrderMock.mockReset().mockResolvedValue(undefined);
    useQueryClientMock.mockReturnValue({ invalidateQueries: invalidateQueriesMock });
    useMutationMock.mockReset().mockReturnValue({
      mutate: vi.fn(),
      isError: false,
      isPending: false,
    });
    useMutationMock.mockReturnValue({ mutate: vi.fn(), isError: false, isPending: false });
    useOrderDetailQueryMock.mockReturnValue({
      data: orderDetail,
      error: null,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
  });

  it('취소 화면에서 상품 목록은 생략하고 주문 상세 API의 결제 정보와 취소 사유를 사용한다', () => {
    const markup = renderToStaticMarkup(<OrderCancelPage orderId="ORDER_1" />);

    expect(markup).toContain('취소 사유 선택');
    expect(markup).toContain('단순 변심');
    expect(markup).not.toContain('2026.09.30');
    expect(markup).not.toContain('>주문 상세</a>');
    expect(markup).not.toContain('국내산 대파 1단');
    expect(markup).not.toContain('취소할 상품');
    expect(markup).toContain('15,000원');
    expect(markup).toContain('카드');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('h-2 w-full bg-[var(--primitive-grey-100)]');
    expect(markup).not.toContain('border-t-8');
    expect(markup).not.toContain('하인즈 토마토 케찹');
    expect(markup).toContain('size-[22px]');
    expect(markup).toContain('rounded-full');
  });

  it('주문 상세를 불러오는 동안 취소 폼 대신 로딩 상태를 표시한다', () => {
    useOrderDetailQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<OrderCancelPage orderId="ORDER_1" />);

    expect(markup).toContain('주문 상세를 불러오는 중');
    expect(markup).not.toContain('취소 사유 선택');
  });

  it('취소 성공 후 주문 목록·상세 캐시를 갱신하고 완료 화면으로 이동한다', async () => {
    renderToStaticMarkup(<OrderCancelPage orderId="ORDER_1" />);
    const mutationOptions = useMutationMock.mock.calls[0]?.[0] as {
      onSuccess: () => Promise<void>;
    };

    await mutationOptions.onSuccess();

    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(1, {
      queryKey: ['orders', 'list'],
    });
    expect(invalidateQueriesMock).toHaveBeenNthCalledWith(2, {
      queryKey: ['orders', 'detail', 'ORDER_1'],
    });
    expect(routerPushMock).toHaveBeenCalledWith('/mypage/orders/ORDER_1/cancel/complete');
  });

  it('취소 사유를 API mutation에 그대로 전달한다', async () => {
    renderToStaticMarkup(<OrderCancelPage orderId="ORDER_1" />);
    const mutationOptions = useMutationMock.mock.calls[0]?.[0] as {
      mutationFn: (reason: string) => Promise<void>;
    };

    await mutationOptions.mutationFn('추가 주문');

    expect(cancelOrderMock).toHaveBeenCalledWith('ORDER_1', '추가 주문');
  });

  it('취소 API 실패 시 완료 화면 대신 오류 메시지를 표시한다', () => {
    useMutationMock.mockReturnValue({ mutate: vi.fn(), isError: true, isPending: false });

    const markup = renderToStaticMarkup(<OrderCancelPage orderId="ORDER_1" />);

    expect(markup).toContain('주문 취소를 요청하지 못했어요');
  });

  it('선택한 취소 사유에는 primitive primary-500 테두리를 적용한다', () => {
    expect(getCancellationReasonBorderColor(true)).toBe('var(--primitive-primary-500)');
    expect(getCancellationReasonBorderColor(false)).toBe('var(--border-default)');
  });

  it('선택된 취소 사유 라디오는 노란색 바깥 원과 흰색 가운데 원을 표시한다', () => {
    expect(getCancellationReasonRadioClasses(true)).toEqual({
      outer: 'bg-primary',
      inner: 'bg-background',
    });
    expect(getCancellationReasonRadioClasses(false)).toEqual({
      outer: 'border border-border',
      inner: '',
    });
  });

  it('동의 체크는 기본 회색, 선택 시 primitive primary-500 배경을 적용한다', () => {
    expect(getAgreementCheckClassName(false)).toContain('bg-surface-disabled');
    expect(getAgreementCheckClassName(true)).toContain('bg-[var(--primitive-primary-500)]');
  });
});
