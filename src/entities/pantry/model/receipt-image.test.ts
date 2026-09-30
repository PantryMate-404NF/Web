import { describe, expect, it } from 'vitest';

import { getReceiptImageValidationError } from './receipt-image';

describe('receipt image validation', () => {
  it('accepts JPEG, PNG, WebP, and HEIC files up to 10 MB', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/heic']) {
      expect(
        getReceiptImageValidationError({ name: 'receipt', size: 10 * 1024 * 1024, type }),
      ).toBe(null);
    }
  });

  it('rejects unsupported formats and files larger than 10 MB', () => {
    expect(
      getReceiptImageValidationError({ name: 'receipt.pdf', size: 100, type: 'application/pdf' }),
    ).toBe('JPEG, PNG, WebP, HEIC 형식의 10MB 이하 영수증 이미지를 선택해주세요.');
    expect(
      getReceiptImageValidationError({
        name: 'receipt.jpg',
        size: 10 * 1024 * 1024 + 1,
        type: 'image/jpeg',
      }),
    ).toBe('JPEG, PNG, WebP, HEIC 형식의 10MB 이하 영수증 이미지를 선택해주세요.');
  });
});
