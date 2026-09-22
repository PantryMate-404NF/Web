import { Children } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { SystemErrorState } from './system-error-state';

describe('SystemErrorState', () => {
  it('announces a loading failure and retries with the supplied handler', () => {
    const onRetry = vi.fn();
    const errorState = SystemErrorState({
      onRetry,
      title: '레시피를 불러오지 못했어요',
    });

    expect(errorState.props.role).toBe('alert');
    expect(errorState.props.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({ children: '레시피를 불러오지 못했어요' }),
        }),
      ]),
    );

    const retryButton = Children.toArray(errorState.props.children).at(-1);
    expect(retryButton).toMatchObject({ props: { children: '다시 시도', onClick: onRetry } });
  });
});
