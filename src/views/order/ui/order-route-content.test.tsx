import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OrderRouteContent } from './order-route-content';

const { useAuthSessionMock, useCartQueryMock, useDefaultAddressQueryMock } = vi.hoisted(() => ({
  useAuthSessionMock: vi.fn(),
  useCartQueryMock: vi.fn(),
  useDefaultAddressQueryMock: vi.fn(),
}));

vi.mock('@/features/auth/ui/auth-session-provider', () => ({ useAuthSession: useAuthSessionMock }));
vi.mock('@/entities/cart/api/use-cart-query', () => ({ useCartQuery: useCartQueryMock }));
vi.mock('@/entities/address/api/use-default-address-query', () => ({
  useDefaultAddressQuery: useDefaultAddressQueryMock,
}));

describe('OrderRouteContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('주문서에 서버 장바구니와 선택 항목을 전달한다', () => {
    const items = [{ id: '10', ingredient: '기본 옵션', name: '양파', price: 3900, quantity: 1 }];
    useCartQueryMock.mockReturnValue({
      data: { cartId: 3, items },
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    const defaultAddress = {
      id: '12',
      recipientName: '김지웅',
      phoneNumber: '01012345678',
      addressLine1: '경기도 성남시 분당구 불정로 90',
      addressLine2: '101동 1001호',
      postalCode: '13485',
      isDefault: true,
    };
    useDefaultAddressQueryMock.mockReturnValue({
      data: defaultAddress,
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });
    useAuthSessionMock.mockReturnValue({ state: 'complete' });

    const page = OrderRouteContent({
      cartId: 99,
      selectedItemIds: ['10'],
    });

    expect(useCartQueryMock).toHaveBeenCalledWith(true);
    expect(useDefaultAddressQueryMock).toHaveBeenCalledWith(true);
    expect(page.props).toMatchObject({
      cartId: 3,
      defaultAddress,
      items,
      selectedItemIds: ['10'],
    });
  });

  it('로그인 세션 복구 중에는 주문 장바구니 조회를 시작하지 않는다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'loading' });
    useCartQueryMock.mockReturnValue({ data: undefined, error: null, isPending: true });
    useDefaultAddressQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });

    const page = OrderRouteContent({ selectedItemIds: ['10'] });

    expect(useCartQueryMock).toHaveBeenCalledWith(false);
    expect(page.props).toMatchObject({ isLoading: true });
  });

  it('로컬 미리보기에서는 장바구니 조회를 생략하고 기본 배송지는 조회한다', () => {
    const defaultAddress = {
      id: '12',
      recipientName: '김지웅',
      phoneNumber: '01012345678',
      addressLine1: '경기도 성남시 분당구 불정로 90',
      addressLine2: '101동 1001호',
      postalCode: '13485',
      isDefault: true,
    };
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useCartQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });
    useDefaultAddressQueryMock.mockReturnValue({
      data: defaultAddress,
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });

    const page = OrderRouteContent({ localPreview: true, selectedItemIds: ['local-item'] });

    expect(useCartQueryMock).toHaveBeenCalledWith(false);
    expect(useDefaultAddressQueryMock).toHaveBeenCalledWith(true);
    expect(page.props).toMatchObject({ defaultAddress, paymentDisabled: true });
  });

  it('비로그인 로컬 미리보기에서 비활성 쿼리의 pending 상태로 무한 로딩하지 않는다', () => {
    useAuthSessionMock.mockReturnValue({ state: 'guest' });
    useCartQueryMock.mockReturnValue({ data: undefined, error: null, isPending: true });
    useDefaultAddressQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
      refetch: vi.fn(),
    });

    const page = OrderRouteContent({ localPreview: true, selectedItemIds: ['local-item'] });

    expect(useDefaultAddressQueryMock).toHaveBeenCalledWith(false);
    expect(page.props).toMatchObject({ isLoading: false, paymentDisabled: true });
  });

  it('목 상품 주문서에서도 로그인 사용자의 기본 배송지는 조회한다', () => {
    const previewItems = [
      { id: 'preview-item', ingredient: '양파', name: '국산 양파', price: 3900, quantity: 1 },
    ];
    const defaultAddress = {
      id: '12',
      recipientName: '김지웅',
      phoneNumber: '01012345678',
      addressLine1: '경기도 성남시 분당구 불정로 90',
      addressLine2: '101동 1001호',
      postalCode: '13485',
      isDefault: true,
    };
    useAuthSessionMock.mockReturnValue({ state: 'complete' });
    useCartQueryMock.mockReturnValue({ data: undefined, error: null, isPending: false });
    useDefaultAddressQueryMock.mockReturnValue({
      data: defaultAddress,
      error: null,
      isPending: false,
      refetch: vi.fn(),
    });

    const page = OrderRouteContent({ previewItems, selectedItemIds: [] });

    expect(useCartQueryMock).toHaveBeenCalledWith(false);
    expect(useDefaultAddressQueryMock).toHaveBeenCalledWith(true);
    expect(page.props).toMatchObject({ defaultAddress, items: previewItems });
  });
});
