import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getProductDetail } from './get-product-detail';

const { requestMock } = vi.hoisted(() => ({ requestMock: vi.fn() }));

vi.mock('@/shared/api/http-client', () => ({ request: requestMock }));

describe('getProductDetail', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  it('상품 ID로 공개 상세 API를 요청한다', async () => {
    requestMock.mockResolvedValue({ productId: 157 });

    await getProductDetail(157);

    expect(requestMock).toHaveBeenCalledWith('/api/products/157', { auth: false });
  });
});
