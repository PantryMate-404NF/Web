import { describe, expect, it } from 'vitest';

import { getCartHref, getCartWriteMode } from './cart-write-mode';

describe('getCartWriteMode', () => {
  it('계약이 확정된 API만 운영 요청을 허용한다', () => {
    expect(
      getCartWriteMode({ apiEnabled: true, apiMockingEnabled: false, isDevelopment: false }),
    ).toBe('api');
    expect(
      getCartWriteMode({ apiEnabled: false, apiMockingEnabled: false, isDevelopment: false }),
    ).toBe('disabled');
  });

  it('개발 환경은 실제 API 대신 preview를 사용한다', () => {
    expect(
      getCartWriteMode({ apiEnabled: false, apiMockingEnabled: false, isDevelopment: true }),
    ).toBe('preview');
  });

  it('MSW를 명시적으로 켜면 API 계약 목업을 호출한다', () => {
    expect(
      getCartWriteMode({ apiEnabled: false, apiMockingEnabled: true, isDevelopment: true }),
    ).toBe('mock-api');
  });

  it('운영 환경에서는 공개 목업 플래그가 켜져도 목 상품 ID를 사용하지 않는다', () => {
    expect(
      getCartWriteMode({ apiEnabled: false, apiMockingEnabled: true, isDevelopment: false }),
    ).toBe('disabled');
  });

  it('로컬 미리보기 장바구니 경로를 일관되게 반환한다', () => {
    expect(getCartHref('preview')).toBe('/cart?preview=local');
    expect(getCartHref('api')).toBe('/cart');
  });
});
