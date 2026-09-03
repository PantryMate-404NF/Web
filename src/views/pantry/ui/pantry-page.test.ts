import { Children, isValidElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { getPantryCardVariant } from '@/entities/pantry/model/types';
import { pantryItems } from '@/entities/pantry/model/mock';

import { getPantryViewState, PantryErrorState } from './pantry-page';

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

describe('getPantryCardVariant', () => {
  it('uses the image card variant when the comparison route requests it', () => {
    expect(getPantryCardVariant('image')).toBe('image');
  });

  it('keeps the existing icon card variant as the default', () => {
    expect(getPantryCardVariant()).toBe('icon');
  });
});
