import { describe, expect, it } from 'vitest';

import {
  formatPantryDate,
  getCalendarMonthCells,
  getPantryMockState,
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
