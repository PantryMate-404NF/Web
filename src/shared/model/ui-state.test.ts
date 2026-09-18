import { describe, expect, it } from 'vitest';

import { isDataViewState, isInteractionState } from './ui-state';

describe('isDataViewState', () => {
  it('accepts every documented data loading state', () => {
    expect(isDataViewState('loading')).toBe(true);
    expect(isDataViewState('content')).toBe(true);
    expect(isDataViewState('empty')).toBe(true);
    expect(isDataViewState('error')).toBe(true);
    expect(isDataViewState('unauthorized')).toBe(true);
  });

  it('rejects component interaction states', () => {
    expect(isDataViewState('disabled')).toBe(false);
  });
});

describe('isInteractionState', () => {
  it('accepts every documented component interaction state', () => {
    expect(isInteractionState('default')).toBe(true);
    expect(isInteractionState('pressed')).toBe(true);
    expect(isInteractionState('disabled')).toBe(true);
    expect(isInteractionState('loading')).toBe(true);
  });

  it('rejects a data-only state', () => {
    expect(isInteractionState('unauthorized')).toBe(false);
  });
});
