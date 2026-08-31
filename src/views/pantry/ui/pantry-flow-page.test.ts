import { describe, expect, it } from 'vitest';

import { getPantryMockState } from './pantry-flow-page';

describe('getPantryMockState', () => {
  it('supports each pantry wireframe state', () => {
    expect(getPantryMockState('empty')).toBe('empty');
    expect(getPantryMockState('delivery-complete')).toBe('delivery-complete');
    expect(getPantryMockState('edit')).toBe('edit');
    expect(getPantryMockState('delete-confirm')).toBe('delete-confirm');
  });

  it('uses the full pantry state for unsupported values', () => {
    expect(getPantryMockState('unknown')).toBe('full');
  });
});
