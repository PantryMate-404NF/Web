import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  confirmPayment: vi.fn(),
  createPantryItem: vi.fn(),
  deleteCartItem: vi.fn(),
  getCart: vi.fn(),
  getProductDetail: vi.fn(),
  invalidateQueries: vi.fn(),
  restore: vi.fn(),
  setState: vi.fn(),
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();

  return {
    ...actual,
    useCallback: (callback: unknown) => callback,
    useEffect: (effect: () => void) => effect(),
    useRef: (current: unknown) => ({ current }),
    useState: (initial: unknown) => [initial, mocks.setState],
  };
});

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    fetchQuery: vi.fn(),
    invalidateQueries: mocks.invalidateQueries,
  }),
}));

vi.mock('@/features/auth/ui/auth-session-provider', () => ({
  useAuthSession: () => ({ restore: mocks.restore }),
}));

vi.mock('@/features/payment/api/confirm-payment', () => ({
  confirmPayment: mocks.confirmPayment,
}));

vi.mock('@/entities/pantry/api/create-pantry-item', () => ({
  createPantryItem: mocks.createPantryItem,
}));

vi.mock('@/entities/product/api/get-product-detail', () => ({
  getProductDetail: mocks.getProductDetail,
}));

vi.mock('@/entities/cart/api/delete-cart-item', () => ({
  deleteCartItem: mocks.deleteCartItem,
}));

vi.mock('@/entities/cart/api/get-cart', () => ({
  getCart: mocks.getCart,
}));

import { ORDER_LIST_QUERY_KEY } from '@/entities/order/model/query-key';

import { PaymentSuccessPage } from './payment-success-page';

describe('PaymentSuccessPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('결제 완료 상품은 주문 목록에 남기고 팬트리 등록 API는 호출하지 않는다', async () => {
    const completionSnapshot = {
      selectedCartItemIds: [],
      deliveryAddress: {
        addressLine1: '서울시 강남구 테헤란로 1',
        addressLine2: '101호',
        phoneNumber: '01012345678',
        postalCode: '06123',
        recipientName: '김지웅',
      },
      deliveryRequest: { detail: '없음', location: '문 앞에 놓아주세요' },
      items: [
        {
          id: 'cart-item-1',
          imageUrl: 'https://cdn.example.com/onion.png',
          name: '국산 양파',
          price: 5900,
          productId: 150,
          quantity: 2,
        },
      ],
      orderNumber: 'ORDER_1',
      orderedAt: '2026-10-02T00:00:00Z',
      orderer: { name: '김지웅', phoneNumber: '01012345678' },
      paymentAmount: 11800,
    };
    const sessionStorage = {
      getItem: () =>
        JSON.stringify({
          amount: 11800,
          completionSnapshot,
          name: '국산 양파',
          orderId: 'ORDER_1',
        }),
      removeItem: vi.fn(),
    };

    vi.stubGlobal('window', { sessionStorage });
    mocks.restore.mockResolvedValue('complete');
    mocks.confirmPayment.mockResolvedValue({
      approveAt: '2026-10-02T00:00:00Z',
      paymentKey: 'payment-key',
      status: 'DONE',
      totalAmount: 11800,
    });
    mocks.getProductDetail.mockResolvedValue({
      capacity: null,
      categoryId: 12,
      categoryName: '채소',
      description: null,
      images: [],
      ingredientId: 34,
      name: '국산 양파',
      origin: null,
      packageCount: null,
      price: 5900,
      productId: 150,
      sku: 'onion-150',
      status: 'ON_SALE',
      stockQuantity: 10,
      storageType: 'REFRIGERATED',
      thumbnailUrl: 'https://cdn.example.com/onion.png',
      unit: 'EACH',
    });
    mocks.createPantryItem.mockResolvedValue({ pantryItemId: 1 });
    mocks.invalidateQueries.mockResolvedValue(undefined);

    PaymentSuccessPage({ amount: '11800', orderId: 'ORDER_1', paymentKey: 'payment-key' });

    await vi.waitFor(() => {
      expect(mocks.invalidateQueries).toHaveBeenCalledWith({ queryKey: ORDER_LIST_QUERY_KEY });
    });

    expect(mocks.createPantryItem).not.toHaveBeenCalled();
    expect(mocks.getProductDetail).not.toHaveBeenCalled();
    expect(mocks.setState).toHaveBeenCalledWith({
      order: { ...completionSnapshot, orderNumber: 'ORDER_1', paymentAmount: 11800 },
      status: 'done',
    });
  });
});
