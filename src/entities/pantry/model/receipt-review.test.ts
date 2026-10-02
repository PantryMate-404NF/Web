import { describe, expect, it } from 'vitest';

import { areReceiptReviewItemsSubmittable, createReceiptReviewItem } from './receipt-review';

describe('receipt review validation', () => {
  it('allows registration without a purchase date but requires items, a name, and storage type', () => {
    const completeItems = [{ name: '계란', storageType: 'REFRIGERATED' as const }];

    expect(areReceiptReviewItemsSubmittable(completeItems)).toBe(true);
    expect(areReceiptReviewItemsSubmittable([])).toBe(false);
    expect(areReceiptReviewItemsSubmittable([{ name: '계란', storageType: null }])).toBe(false);
  });

  it('rejects blank names even when a storage method is selected', () => {
    expect(areReceiptReviewItemsSubmittable([{ name: '  ', storageType: 'FROZEN' }])).toBe(false);
  });
});

describe('receipt review item drafts', () => {
  it('prefills only the OCR name and leaves registration details for the user', () => {
    expect(createReceiptReviewItem('receipt-1', '깐마늘')).toEqual({
      consumptionDate: '',
      expirationDate: '',
      imageFile: undefined,
      imagePreviewUrl: undefined,
      id: 'receipt-1',
      name: '깐마늘',
      storageType: null,
    });
  });

  it('keeps the OCR purchase date for server-side consumption-date calculation', () => {
    expect(createReceiptReviewItem('receipt-1', '계란', '2026-09-29')).toMatchObject({
      purchaseDate: '2026-09-29',
    });
  });
});
