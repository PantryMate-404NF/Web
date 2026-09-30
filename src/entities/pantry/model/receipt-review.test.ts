import { describe, expect, it } from 'vitest';

import { areReceiptReviewItemsSubmittable, createReceiptReviewItem } from './receipt-review';

describe('receipt review validation', () => {
  it('requires a purchase date, at least one item, a name, and a storage type for each item', () => {
    const completeItems = [{ name: '계란', storageType: 'REFRIGERATED' as const }];

    expect(areReceiptReviewItemsSubmittable('', completeItems)).toBe(false);
    expect(areReceiptReviewItemsSubmittable('2026-09-29', [])).toBe(false);
    expect(
      areReceiptReviewItemsSubmittable('2026-09-29', [{ name: '계란', storageType: null }]),
    ).toBe(false);
    expect(areReceiptReviewItemsSubmittable('2026-09-29', completeItems)).toBe(true);
  });

  it('rejects blank names even when a storage method is selected', () => {
    expect(
      areReceiptReviewItemsSubmittable('2026-09-29', [{ name: '  ', storageType: 'FROZEN' }]),
    ).toBe(false);
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
});
