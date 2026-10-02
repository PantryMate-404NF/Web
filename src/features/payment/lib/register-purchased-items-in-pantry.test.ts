import { describe, expect, it, vi } from 'vitest';

import { registerPurchasedItemsInPantry } from './register-purchased-items-in-pantry';

describe('registerPurchasedItemsInPantry', () => {
  it('상품 API의 보관 방법으로 구매 상품을 팬트리에 등록하고 같은 주문 재호출은 건너뛴다', async () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    const getProductDetail = vi.fn().mockResolvedValue({
      categoryId: 208,
      categoryName: '조미료',
      description: null,
      images: [],
      ingredientId: 17310,
      name: '자연 프리미엄 야생화꿀',
      origin: null,
      packageCount: null,
      price: 18000,
      productId: 150,
      sku: '3762',
      status: 'ON_SALE',
      stockQuantity: 49,
      storageType: 'ROOM_TEMP',
      thumbnailUrl: 'https://cdn.example.com/thumb.jpg',
      unit: 'EACH',
      capacity: null,
    });
    const createPantryItem = vi.fn().mockResolvedValue({ pantryItemId: 4 });
    const item = { id: 'cart-item-4', name: '야생화꿀', productId: 150 };

    await expect(
      registerPurchasedItemsInPantry('ORDER_4', [item], {
        createPantryItem,
        getProductDetail,
        storage,
      }),
    ).resolves.toEqual({ failedItems: [], registeredCount: 1 });

    expect(createPantryItem).toHaveBeenCalledWith({
      ingredientName: '자연 프리미엄 야생화꿀',
      imageUrl: 'https://cdn.example.com/thumb.jpg',
      registerType: 'AUTO',
      storageType: 'ROOM_TEMP',
    });

    await registerPurchasedItemsInPantry('ORDER_4', [item], {
      createPantryItem,
      getProductDetail,
      storage,
    });

    expect(getProductDetail).toHaveBeenCalledTimes(1);
    expect(createPantryItem).toHaveBeenCalledTimes(1);
  });

  it('상품 보관 방법이 없거나 상품 ID를 알 수 없으면 팬트리 요청을 보내지 않고 실패 상품을 반환한다', async () => {
    const createPantryItem = vi.fn();
    const result = await registerPurchasedItemsInPantry(
      'ORDER_5',
      [
        { id: 'cart-item-5', name: '감자', productId: 151 },
        { id: 'cart-item-6', name: '대파' },
      ],
      {
        createPantryItem,
        getProductDetail: vi.fn().mockResolvedValue({
          categoryId: 208,
          categoryName: '채소',
          description: null,
          images: [],
          ingredientId: 17311,
          name: '감자',
          origin: null,
          packageCount: null,
          price: 3000,
          productId: 151,
          sku: '151',
          status: 'ON_SALE',
          stockQuantity: 20,
          storageType: null,
          thumbnailUrl: null,
          unit: 'EACH',
          capacity: null,
        }),
        storage: {
          getItem: () => null,
          setItem: vi.fn(),
        },
      },
    );

    expect(result).toEqual({
      failedItems: [
        { itemId: 'cart-item-5', itemName: '감자', reason: 'missing-storage-type' },
        { itemId: 'cart-item-6', itemName: '대파', reason: 'missing-product-id' },
      ],
      registeredCount: 0,
    });
    expect(createPantryItem).not.toHaveBeenCalled();
  });

  it('상품 조회 실패와 팬트리 등록 실패를 구분해 반환한다', async () => {
    const result = await registerPurchasedItemsInPantry(
      'ORDER_6',
      [
        { id: 'cart-item-7', name: '미니오이', productId: 157 },
        { id: 'cart-item-8', name: '파프리카', productId: 158 },
      ],
      {
        createPantryItem: vi.fn().mockRejectedValue(new Error('등록 실패')),
        getProductDetail: vi
          .fn()
          .mockRejectedValueOnce(new Error('조회 실패'))
          .mockResolvedValueOnce({
            categoryId: 208,
            categoryName: '채소',
            description: null,
            images: [],
            ingredientId: 17312,
            name: '노랑 파프리카',
            origin: null,
            packageCount: null,
            price: 2200,
            productId: 158,
            sku: '158',
            status: 'ON_SALE',
            stockQuantity: 20,
            storageType: 'REFRIGERATED',
            thumbnailUrl: null,
            unit: 'EACH',
            capacity: null,
          }),
        storage: { getItem: () => null, setItem: vi.fn() },
      },
    );

    expect(result).toEqual({
      failedItems: [
        { itemId: 'cart-item-7', itemName: '미니오이', reason: 'product-detail-request' },
        { itemId: 'cart-item-8', itemName: '파프리카', reason: 'pantry-create-request' },
      ],
      registeredCount: 0,
    });
  });
});
