import { Children, isValidElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { getPantryCardVariant } from '@/entities/pantry/model/types';
import { pantryItems } from '@/entities/pantry/model/mock';

import {
  getDeleteConfirmationTitle,
  getPantryMenuPosition,
  getPantryViewState,
  getVisiblePantryItems,
  PantryDeleteDialog,
  PantryEmptyState,
  PantryErrorState,
  PantryAddOptions,
  PantryPage,
} from './pantry-page';

describe('getPantryViewState', () => {
  it('returns empty when no item is available', () => {
    expect(getPantryViewState({ items: [] })).toBe('empty');
  });

  it('prioritizes error over all other states', () => {
    expect(
      getPantryViewState({
        items: [],
        errorMessage: '팬트리 정보를 불러오지 못했습니다.',
      }),
    ).toBe('error');
  });

  it('returns loading while pantry data is being requested', () => {
    expect(getPantryViewState({ items: [], isLoading: true })).toBe('loading');
  });

  it('returns content when pantry items are available', () => {
    expect(getPantryViewState({ items: pantryItems })).toBe('content');
  });
});

describe('PantryErrorState', () => {
  it('announces an error immediately and binds the retry handler', () => {
    const onRetry = vi.fn();
    const errorState = PantryErrorState({
      message: '팬트리 정보를 불러오지 못했습니다.',
      onRetry,
    });

    expect(errorState.props.role).toBe('alert');
    expect(errorState.props['aria-live']).toBeUndefined();

    const retryButton = Children.toArray(errorState.props.children).at(-1);

    expect(isValidElement<{ onClick?: () => void }>(retryButton)).toBe(true);

    if (!isValidElement<{ onClick?: () => void }>(retryButton)) {
      throw new Error('다시 시도 버튼을 찾을 수 없습니다.');
    }

    retryButton.props.onClick?.();

    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('PantryEmptyState', () => {
  it('renders the Figma empty-state image and guidance', () => {
    const emptyState = PantryEmptyState();
    const content = Children.toArray(emptyState.props.children);
    const image = content[0];

    expect(isValidElement<{ src?: string; width?: number; height?: number }>(image)).toBe(true);

    if (!isValidElement<{ src?: string; width?: number; height?: number }>(image)) {
      throw new Error('빈 상태 이미지를 찾을 수 없습니다.');
    }

    expect(image.props.src).toBe('/images/pantry/empty-image.svg');
    expect(image.props.width).toBe(160);
    expect(image.props.height).toBe(160);
    expect(emptyState.props['aria-label']).toBe('등록된 식재료 없음');
  });
});

describe('PantryDeleteDialog', () => {
  it('renders the Figma-sized confirmation dialog for the selected item', () => {
    const dialog = PantryDeleteDialog({
      itemName: '양상추',
      onCancel: vi.fn(),
      onConfirm: vi.fn(),
      dialogRef: { current: null },
    });

    expect(dialog.props['aria-modal']).toBe(true);
    expect(dialog.props.tabIndex).toBe(-1);
    expect(dialog.props.className).toContain('w-[308px]');
    expect(dialog.props.className).toContain('h-[212px]');
  });
});

describe('getPantryCardVariant', () => {
  it('uses the Figma image-card variant unless the compact view is explicitly requested', () => {
    expect(getPantryCardVariant()).toBe('image');
    expect(getPantryCardVariant('image')).toBe('image');
    expect(getPantryCardVariant('icon')).toBe('icon');
  });
});

describe('getVisiblePantryItems', () => {
  it('applies search, storage filter, and sort together', () => {
    const items = pantryItems.map((item, index) => ({
      ...item,
      createdAt: `2026-09-0${index + 1}T00:00:00Z`,
      storageType: index < 2 ? ('REFRIGERATED' as const) : ('FROZEN' as const),
    }));

    expect(getVisiblePantryItems(items, '대', 'REFRIGERATED', 'OLDEST')).toEqual([
      expect.objectContaining({ name: '대파' }),
    ]);
  });
});

describe('getDeleteConfirmationTitle', () => {
  it('uses the correct Korean object particle', () => {
    expect(getDeleteConfirmationTitle('대파')).toBe('대파를 삭제할까요?');
    expect(getDeleteConfirmationTitle('양상추')).toBe('양상추를 삭제할까요?');
    expect(getDeleteConfirmationTitle('계란')).toBe('계란을 삭제할까요?');
  });
});

describe('getPantryMenuPosition', () => {
  it('opens beside a left-column card and keeps a right-column menu inside the viewport', () => {
    expect(getPantryMenuPosition({ left: 155, right: 195, top: 259 }, 390)).toEqual({
      left: 188,
      top: 255,
    });
    expect(getPantryMenuPosition({ left: 340, right: 380, top: 259 }, 390)).toEqual({
      left: 224,
      top: 255,
    });
  });
});

describe('PantryAddOptions', () => {
  it('opens the image picker for receipt upload and keeps manual registration on the register route', () => {
    const onReceiptUpload = vi.fn();
    const options = PantryAddOptions({ onReceiptUpload });
    const [receiptUploadButton, manualRegistrationLink] = Children.toArray(options.props.children);

    expect(isValidElement<{ onClick?: () => void }>(receiptUploadButton)).toBe(true);
    expect(isValidElement<{ href?: string }>(manualRegistrationLink)).toBe(true);

    if (
      !isValidElement<{ onClick?: () => void }>(receiptUploadButton) ||
      !isValidElement<{ href?: string }>(manualRegistrationLink)
    ) {
      throw new Error('팬트리 추가 메뉴 항목을 찾을 수 없습니다.');
    }

    receiptUploadButton.props.onClick?.();

    expect(onReceiptUpload).toHaveBeenCalledOnce();
    expect(manualRegistrationLink.props.href).toBe('/pantry?state=register');
  });
});

describe('pantry sort layout', () => {
  it('uses Hug widths for the selected label and the 40px arrow area', () => {
    const pageSource = PantryPage.toString();

    expect(pageSource).toContain('flex h-10 w-max shrink-0 items-center justify-end');
    expect(pageSource).toContain('whitespace-nowrap');
    expect(pageSource).not.toContain('absolute top-1/2');
    expect(pageSource).toContain('w-max min-w-[134px]');
  });
});
