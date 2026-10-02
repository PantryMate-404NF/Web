import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useOrderHistoryQueryMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/order/api/use-order-history-query', () => ({
  useOrderHistoryQuery: useOrderHistoryQueryMock,
}));

import { DeliveryTrackingPage } from './delivery-tracking-page';

const orders = [
  {
    id: 'ORDER_1',
    orderedAt: '2026.09.30',
    orderNumber: 'ORDER_1',
    paymentAmount: 12000,
    status: 'CONFIRMED',
    statusLabel: '결제 완료',
    items: [
      {
        id: 'ORDER_1-0',
        productId: 150,
        name: '자연 프리미엄 야생화꿀',
        price: 18000,
        quantity: 1,
        thumbnailUrl: 'https://cdn.example.com/honey.jpg',
      },
    ],
  },
  {
    id: 'ORDER_2',
    orderedAt: '2026.09.29',
    orderNumber: 'ORDER_2',
    paymentAmount: 6000,
    status: 'CONFIRMED',
    statusLabel: '결제 완료',
    items: [
      {
        id: 'ORDER_2-0',
        productId: 151,
        name: '국내산 대파',
        price: 6000,
        quantity: 2,
        thumbnailUrl: null,
      },
    ],
  },
];

describe('DeliveryTrackingPage', () => {
  beforeEach(() => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: orders,
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });
  });

  it('배송 준비·완료와 배송 중 아이콘을 각각 지정 크기로 표시한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage orderId="ORDER_1" />);
    const progress = markup.match(
      /<section[^>]*aria-label="배송 진행 상태">([\s\S]*?)<\/section>/,
    )?.[1];
    const icons = progress?.match(
      /<img[^>]*src="\/icons\/delivery\/status-(?:ready|shipping|complete)\.svg"[^>]*>/g,
    );

    expect(icons).toHaveLength(3);
    icons
      ?.filter((icon) => !icon.includes('status-shipping.svg'))
      .forEach((icon) => {
        expect(icon).toContain('h-[17.9px]');
        expect(icon).toContain('w-4');
        expect(icon).toContain('width="16"');
        expect(icon).toContain('height="18"');
      });
    const shippingIcon = icons?.find((icon) => icon.includes('status-shipping.svg'));

    expect(shippingIcon).toContain('h-[14.5px]');
    expect(shippingIcon).toContain('w-[21.5px]');
    expect(shippingIcon).toContain('width="22"');
    expect(shippingIcon).toContain('height="15"');
  });

  it('기존 결제 완료 주문 조회 결과에서 선택한 주문의 실제 상품을 배송 완료로 표시한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage orderId="ORDER_1" />);

    expect(useOrderHistoryQueryMock).toHaveBeenCalledWith('CONFIRMED');
    expect(markup).toContain('배송 완료');
    expect(markup).toContain('구매 상품');
    expect(markup).toContain('자연 프리미엄 야생화꿀');
    expect(markup).toContain('https://cdn.example.com/honey.jpg');
    expect(markup).not.toContain('국내산 대파');
    expect(markup).not.toContain('하인즈 토마토 케찹');
  });

  it('배송 완료 정보의 긴 주문번호를 가용 너비 안에서 말줄임 처리한다', () => {
    const orderNumber = 'ORDER_01a0f0b0100d7dee9b1dbbe83ee33279';
    useOrderHistoryQueryMock.mockReturnValue({
      data: [{ ...orders[0], orderNumber }],
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<DeliveryTrackingPage orderId="ORDER_1" />);

    expect(markup).toContain(orderNumber);
    expect(markup).toMatch(
      /<dd class="[^"]*min-w-0 truncate[^"]*">ORDER_01a0f0b0100d7dee9b1dbbe83ee33279<\/dd>/,
    );
  });

  it('orderId가 없으면 기존 결제 완료 목록의 첫 주문을 표시한다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('자연 프리미엄 야생화꿀');
  });

  it('preparing 주문은 기존 조회 결과를 사용하고 배송 준비 단계만 강조한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: [{ ...orders[0], status: 'PENDING', statusLabel: '결제 대기' }],
      isError: false,
      isPending: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<DeliveryTrackingPage preparingOrderId="ORDER_1" />);
    const progress = markup.match(
      /<section[^>]*aria-label="배송 진행 상태">([\s\S]*?)<\/section>/,
    )?.[1];
    const activeSteps = progress?.match(/class="grid size-12[^\"]*border-primary/g);
    const readyIcon = progress?.match(
      /<img[^>]*src="\/icons\/delivery\/status-ready\.svg"[^>]*>/,
    )?.[0];
    const completeIcon = progress?.match(
      /<img[^>]*src="\/icons\/delivery\/status-complete\.svg"[^>]*>/,
    )?.[0];

    expect(useOrderHistoryQueryMock).toHaveBeenCalledWith(undefined);
    expect(markup).toContain('배송 조회');
    expect(markup).toContain('자연 프리미엄 야생화꿀');
    expect(activeSteps).toHaveLength(1);
    expect(progress?.indexOf('border-primary')).toBeLessThan(progress?.indexOf('배송 준비') ?? 0);
    expect(readyIcon).toContain('drop-shadow-[0_0_0.75px_currentColor]');
    expect(readyIcon).toContain('brightness-0');
    expect(completeIcon).toContain('opacity-50');
    expect(markup).toContain('상품 배송 준비 중');
    expect(markup).not.toContain('배송 완료 정보');
  });

  it('실제 배송 정보가 없는 운송장·택배사 목업은 표시하지 않는다', () => {
    const markup = renderToStaticMarkup(<DeliveryTrackingPage orderId="ORDER_1" />);

    expect(markup).not.toContain('CJ대한통운');
    expect(markup).not.toContain('441481641546');
    expect(markup).not.toContain('한바쁨');
    expect(markup).toContain('ORDER_1');
    const progress = markup.match(
      /<section[^>]*aria-label="배송 진행 상태">([\s\S]*?)<\/section>/,
    )?.[1];
    const readyIcon = progress?.match(
      /<img[^>]*src="\/icons\/delivery\/status-ready\.svg"[^>]*>/,
    )?.[0];
    const completeIcon = progress?.match(
      /<img[^>]*src="\/icons\/delivery\/status-complete\.svg"[^>]*>/,
    )?.[0];

    expect(readyIcon).toContain('opacity-50');
    expect(completeIcon).toContain('drop-shadow-[0_0_0.75px_currentColor]');
    expect(completeIcon).toContain('brightness-0');
  });

  it('주문 조회 중에는 목업 상품 대신 로딩 상태를 표시한다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: undefined,
      isError: false,
      isPending: true,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('주문 내역을 불러오는 중');
    expect(markup).not.toContain('하인즈 토마토 케찹');
  });

  it('주문 내역 조회 오류를 안내하고 다시 시도할 수 있다', () => {
    useOrderHistoryQueryMock.mockReturnValue({
      data: undefined,
      isError: true,
      isPending: false,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(<DeliveryTrackingPage />);

    expect(markup).toContain('주문 내역을 불러오지 못했어요');
    expect(markup).toContain('다시 시도');
  });
});
