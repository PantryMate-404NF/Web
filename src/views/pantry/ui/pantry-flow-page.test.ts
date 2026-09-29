import { describe, expect, it } from 'vitest';

import {
  areIngredientFormsSubmittable,
  formatPantryDate,
  getCalendarSelection,
  getPantryExpirationPresentation,
  getCalendarMonthCells,
  getPantryImageInputProps,
  isPantryImageUploadable,
  getPantryMockState,
  getPantryFieldCompletionClassName,
  getPantryStorageTypeClassName,
  isIngredientFormSubmittable,
} from './pantry-flow-page';

describe('getPantryMockState', () => {
  it('supports each pantry wireframe state', () => {
    expect(getPantryMockState('empty')).toBe('empty');
    expect(getPantryMockState('delivery-complete')).toBe('delivery-complete');
    expect(getPantryMockState('edit')).toBe('edit');
    expect(getPantryMockState('register')).toBe('register');
    expect(getPantryMockState('delete-confirm')).toBe('delete-confirm');
    expect(getPantryMockState('loading')).toBe('loading');
  });

  it('uses the full pantry state for unsupported values', () => {
    expect(getPantryMockState('unknown')).toBe('full');
  });
});

describe('isIngredientFormSubmittable', () => {
  it('requires both an ingredient name and a storage method', () => {
    expect(isIngredientFormSubmittable('', null)).toBe(false);
    expect(isIngredientFormSubmittable('대파', null)).toBe(false);
    expect(isIngredientFormSubmittable('대파', 'REFRIGERATED')).toBe(true);
  });
});

describe('getPantryFieldCompletionClassName', () => {
  it('shows the selected yellow surface only when a field has a value', () => {
    expect(getPantryFieldCompletionClassName(false)).toBe('border-border bg-surface-secondary');
    expect(getPantryFieldCompletionClassName(true)).toBe(
      'pantry-field-complete border-border-complete bg-surface-complete',
    );
  });
});

describe('getPantryStorageTypeClassName', () => {
  it('uses the completion colors for a selected storage type', () => {
    expect(getPantryStorageTypeClassName(true)).toContain('bg-surface-complete');
    expect(getPantryStorageTypeClassName(true)).toContain('border-border-complete');
  });

  it('keeps unselected storage types on the neutral surface', () => {
    expect(getPantryStorageTypeClassName(false)).toContain('bg-surface-secondary');
  });
});

describe('areIngredientFormsSubmittable', () => {
  it('requires every added ingredient to have both a name and storage method', () => {
    expect(
      areIngredientFormsSubmittable([
        { name: '토마토', storageType: 'REFRIGERATED' },
        { name: '', storageType: 'FROZEN' },
      ]),
    ).toBe(false);
    expect(
      areIngredientFormsSubmittable([
        { name: '토마토', storageType: 'REFRIGERATED' },
        { name: '대파', storageType: 'FROZEN' },
      ]),
    ).toBe(true);
  });
});

describe('getPantryImageInputProps', () => {
  it('uses the outward camera for a new photo and the regular picker for an existing image', () => {
    expect(getPantryImageInputProps('camera')).toEqual({
      accept: 'image/jpeg,image/png,image/webp',
      capture: 'environment',
    });
    expect(getPantryImageInputProps('gallery')).toEqual({
      accept: 'image/jpeg,image/png,image/webp',
    });
  });

  it('accepts only JPEG, PNG, or WebP images up to 5MB', () => {
    expect(isPantryImageUploadable({ type: 'image/jpeg', size: 5 * 1024 * 1024 })).toBe(true);
    expect(isPantryImageUploadable({ type: 'image/heic', size: 1024 })).toBe(false);
    expect(isPantryImageUploadable({ type: 'image/png', size: 5 * 1024 * 1024 + 1 })).toBe(false);
  });
});

describe('getCalendarMonthCells', () => {
  it('places September 2026 dates under the correct weekdays', () => {
    const cells = getCalendarMonthCells(2026, 8);

    expect(cells).toHaveLength(35);
    expect(cells.slice(0, 2)).toEqual([null, null]);
    expect(cells[2]).toBe(1);
    expect(cells[31]).toBe(30);
    expect(cells.slice(32)).toEqual([null, null, null]);
  });
});

describe('formatPantryDate', () => {
  it('uses the date format shown in the pantry form', () => {
    expect(formatPantryDate(2026, 8, 3)).toBe('2026-09-03');
  });
});

describe('getCalendarSelection', () => {
  const fallbackDate = new Date(2026, 8, 14, 12);

  it('uses the active field date for the visible month and selected day', () => {
    expect(getCalendarSelection('2026-10-20', fallbackDate)).toEqual({
      selectedDay: 20,
      visibleMonth: { year: 2026, monthIndex: 9 },
    });
  });

  it('uses an explicit fallback date when the active field is empty', () => {
    expect(getCalendarSelection('', fallbackDate)).toEqual({
      selectedDay: 14,
      visibleMonth: { year: 2026, monthIndex: 8 },
    });
  });
});

describe('getPantryExpirationPresentation', () => {
  const today = new Date(2026, 8, 14, 12);

  it('derives the remaining days and imminent status from a consumption date', () => {
    expect(getPantryExpirationPresentation('2026-09-16', today)).toEqual({
      daysUntilExpiration: 2,
      expirationLabel: '소비기한 2일 남음',
      expirationStatus: 'IMMINENT',
    });
  });

  it('returns the unregistered state when no consumption date is selected', () => {
    expect(getPantryExpirationPresentation('', today)).toEqual({
      daysUntilExpiration: null,
      expirationLabel: '소비기한 미등록',
      expirationStatus: 'UNREGISTERED',
    });
  });
});
