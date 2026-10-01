import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import type { ReceiptOcrResult } from '@/entities/pantry/api/recognize-receipt';

import { ReceiptIngredientEditor, ReceiptOcrFlow } from './receipt-ocr-flow';
import { createReceiptReviewItem } from '@/entities/pantry/model/receipt-review';

vi.mock('@/entities/pantry/api/use-pantry-mutations', () => ({
  usePantryMutations: () => ({ create: { mutateAsync: vi.fn() } }),
}));

const result: ReceiptOcrResult = {
  receiptId: 'receipt-1',
  purchasedAt: '2026-09-29',
  items: [{ name: '깐마늘', ingredientId: null }],
};

describe('ReceiptOcrFlow result screen', () => {
  it('renders the pantry registration review layout with inline storage choices', () => {
    const markup = renderToStaticMarkup(
      createElement(ReceiptOcrFlow, {
        onClose: vi.fn(),
        onFileSelected: vi.fn(),
        onManualEntry: vi.fn(),
        onRetry: vi.fn(),
        state: {
          file: new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' }),
          kind: 'result',
          previewUrl: 'blob:receipt',
          result,
        },
      }),
    );

    expect(markup).toContain('식재료 등록');
    expect(markup).toContain('영수증에서 식재료를 인식했어요');
    expect(markup).toContain('bg-surface-complete');
    expect(markup).toContain('h-[35px] w-[30px]');
    expect(markup).toContain('text-label-3 font-semibold');
    expect(markup).not.toContain('text-label-5');
    expect(markup).toContain('깐마늘');
    expect(markup).toContain('보관방법');
    expect(markup).toContain('냉장');
    expect(markup).toContain('냉동');
    expect(markup).toContain('실온');
    expect(markup).toContain('/icons/pantry/receipt-edit.svg');
    expect(markup).toContain('/icons/pantry/receipt-delete.svg');
    expect(markup).toMatch(/class="[^"]*mt-4[^\"]*"[^>]*>팬트리에 등록<\/button>/);
    expect(markup).not.toContain('rounded-full');
    expect(markup).toMatch(/w-\[84px\][^"]*rounded-sm/);
    expect(markup).toContain('max-w-[calc(100%-34px)]');
    expect(markup).toContain('text-[15px]');
    expect(markup).toContain('border-b-[1.5px]');
    expect(markup).not.toContain('인식한 재료를 확인해 주세요');
  });

  it('uses the pantry registration form controls when editing an OCR item', () => {
    const markup = renderToStaticMarkup(
      createElement(ReceiptIngredientEditor, {
        canComplete: true,
        isSaving: false,
        item: createReceiptReviewItem('receipt-item-1', '깐마늘'),
        onChange: vi.fn(),
        onComplete: vi.fn(),
        onImageSelected: vi.fn(),
      }),
    );

    expect(markup).toContain('식재료명');
    expect(markup).toContain('깐마늘');
    expect(markup).toContain('유통기한 선택');
    expect(markup).toContain('소비기한 선택');
    expect(markup).toContain('식재료에 표기된 날짜 유형을 선택해주세요');
    expect(markup).toContain('보관방법');
    expect(markup).toContain('/icons/pantry/calendar.svg');
    expect(markup).toContain('<button aria-label="유통기한 선택"');
    expect(markup).not.toContain('type="date"');
    expect(markup).toContain('식재료 이미지 직접 등록');
    expect(markup).toContain('등록하기');
  });

  it('does not ask for a purchase date when editing an OCR item', () => {
    const markup = renderToStaticMarkup(
      createElement(ReceiptIngredientEditor, {
        canComplete: true,
        isSaving: false,
        item: createReceiptReviewItem('receipt-item-1', '깐마늘'),
        onChange: vi.fn(),
        onComplete: vi.fn(),
        onImageSelected: vi.fn(),
      }),
    );

    expect(markup).not.toContain('구매일');
  });
});
