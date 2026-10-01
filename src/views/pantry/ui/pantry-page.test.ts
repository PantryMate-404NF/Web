import { Children, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { getPantryCardVariant } from '@/entities/pantry/model/types';
import { pantryItems } from '@/entities/pantry/model/mock';

import {
  getRecipeResultsHref,
  getDeleteConfirmationTitle,
  getPantryMenuPosition,
  getPantryBackHref,
  getPantryPagination,
  PANTRY_PAGE_SIZE,
  getPantryViewState,
  getVisiblePantryItems,
  PantryDeleteDialog,
  PantryEmptyState,
  PantryErrorState,
  PantryAddOptions,
  PantryHeaderAction,
  PantryPagination,
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

describe('getRecipeResultsHref', () => {
  it('returns to the filtered recipe list with each selected ingredient ID once', () => {
    expect(getRecipeResultsHref([21, 8, 21])).toBe('/recipe?ingredientIds=21&ingredientIds=8');
    expect(getRecipeResultsHref([])).toBe('/recipe');
  });

  it('includes selected pantry item IDs so recipes can resolve ingredients without IDs', () => {
    expect(getRecipeResultsHref([21, 8], ['egg', 'tomato'])).toBe(
      '/recipe?ingredientIds=21&ingredientIds=8&pantryItemIds=egg&pantryItemIds=tomato',
    );
  });
});

describe('recipe-selection pantry navigation', () => {
  it('returns to recipes without query parameters when selection is cancelled', () => {
    expect(getPantryBackHref(true)).toBe('/recipe');
    expect(getPantryBackHref(false)).toBe('/');
  });

  it('shows a check action with the selected ingredients only in recipe-selection mode', () => {
    const markup = renderToStaticMarkup(
      PantryHeaderAction({
        addOptionsOpen: false,
        isRecipeSelectionMode: true,
        onCompleteSelection: vi.fn(),
        onOpenAddOptions: vi.fn(),
        selectedIngredientIds: [21],
        selectedPantryItemIds: ['egg'],
      }),
    );

    expect(markup).toContain('href="/recipe?ingredientIds=21&amp;pantryItemIds=egg"');
    expect(markup).toContain('aria-label="선택 완료"');
    expect(markup).toContain('lucide-check');
    expect(markup).not.toContain('lucide-plus');
  });

  it('keeps the add button in the regular pantry mode', () => {
    const markup = renderToStaticMarkup(
      PantryHeaderAction({
        addOptionsOpen: false,
        isRecipeSelectionMode: false,
        onCompleteSelection: vi.fn(),
        onOpenAddOptions: vi.fn(),
        selectedIngredientIds: [],
        selectedPantryItemIds: [],
      }),
    );

    expect(markup).toContain('aria-label="재료 추가"');
    expect(markup).toContain('lucide-plus');
    expect(markup).not.toContain('lucide-check');
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

describe('getPantryPagination', () => {
  it('shows pantry items in pages of twenty and reports navigation availability', () => {
    const items = Array.from({ length: 21 }, (_, index) => ({
      ...pantryItems[index % pantryItems.length]!,
      id: `pantry-${index}`,
    }));

    expect(PANTRY_PAGE_SIZE).toBe(20);
    expect(getPantryPagination(items, 0)).toMatchObject({
      items: items.slice(0, 20),
      currentPage: 0,
      totalPages: 2,
      pageNumbers: [0, 1],
      canGoPrevious: false,
      canGoNext: true,
    });
    expect(getPantryPagination(items, 1)).toMatchObject({
      items: [items[20]],
      currentPage: 1,
      totalPages: 2,
      pageNumbers: [0, 1],
      canGoPrevious: true,
      canGoNext: false,
    });
  });

  it('clamps the current page when filtering leaves fewer pantry pages', () => {
    const items = Array.from({ length: 8 }, (_, index) => ({
      ...pantryItems[index % pantryItems.length]!,
      id: `pantry-${index}`,
    }));

    expect(getPantryPagination(items, 3)).toMatchObject({
      items,
      currentPage: 0,
      totalPages: 1,
      pageNumbers: [0],
      canGoPrevious: false,
      canGoNext: false,
    });
  });

  it('shows five numbered pages at a time', () => {
    const items = Array.from({ length: 201 }, (_, index) => ({
      ...pantryItems[index % pantryItems.length]!,
      id: `pantry-${index}`,
    }));

    expect(getPantryPagination(items, 5).pageNumbers).toEqual([5, 6, 7, 8, 9]);
    expect(getPantryPagination(items, 10).pageNumbers).toEqual([10]);
  });
});

describe('PantryPagination', () => {
  it('renders the current pantry page and disables navigation at the ends', () => {
    const markup = renderToStaticMarkup(
      PantryPagination({ page: 0, totalPages: 2, onPageChange: vi.fn() }),
    );

    expect(markup).toContain('aria-label="팬트리 페이지"');
    expect(markup).toContain('aria-label="1페이지"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toMatch(/aria-label="이전 페이지"[^>]*disabled=""/);
    expect(markup).not.toMatch(/aria-label="다음 페이지"[^>]*disabled=""/);
  });

  it('does not render when the pantry fits on one page', () => {
    expect(PantryPagination({ page: 0, totalPages: 1, onPageChange: vi.fn() })).toBeNull();
  });
});

describe('getDeleteConfirmationTitle', () => {
  it('uses the correct Korean object particle', () => {
    expect(getDeleteConfirmationTitle('대파')).toBe('대파를 삭제할까요?');
    expect(getDeleteConfirmationTitle('양상추')).toBe('양상추를 삭제할까요?');
    expect(getDeleteConfirmationTitle('계란')).toBe('계란을 삭제할까요?');
  });

  it('truncates ingredient names at 13 characters, including spaces', () => {
    expect(getDeleteConfirmationTitle('12345 678901')).toBe('12345 678901를 삭제할까요?');
    expect(getDeleteConfirmationTitle('12345 6789012')).toBe('12345 678901...를 삭제할까요?');
    expect(getDeleteConfirmationTitle('상추1234567890감')).toBe('상추1234567890...을 삭제할까요?');
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
