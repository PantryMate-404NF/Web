import { describe, expect, it } from 'vitest';

import { deliveryAddressMocks } from './address';
import { useAddressStore } from './address-store';

describe('address store', () => {
  it('첫 진입 시 목업 배송지를 표시한다', () => {
    expect(useAddressStore.getState().addresses).toEqual(deliveryAddressMocks);
  });
});
