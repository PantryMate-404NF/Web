import { describe, expect, it } from 'vitest';

import { getPantryCardVariant } from '@/entities/pantry/model/types';

import { getPantryViewState } from './pantry-page';

describe('getPantryViewState', () => {
  it('returns empty when no item is available', () => {
    expect(getPantryViewState({ items: [], isLoading: false })).toBe('empty');
  });

  it('prioritizes error over all other states', () => {
    expect(
      getPantryViewState({
        items: [],
        isLoading: true,
        errorMessage: '팬트리 정보를 불러오지 못했습니다.',
      }),
    ).toBe('error');
  });
});

describe('getPantryCardVariant', () => {
  it('uses the image card variant when the comparison route requests it', () => {
    expect(getPantryCardVariant('image')).toBe('image');
  });

  it('keeps the existing icon card variant as the default', () => {
    expect(getPantryCardVariant()).toBe('icon');
  });
});
