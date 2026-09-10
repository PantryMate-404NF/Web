import { Children, isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from '@/shared/ui/skeleton';

import { AuthCallbackLoading } from './auth-callback-content';

describe('AuthCallbackLoading', () => {
  it('shows an animated skeleton instead of login status text', () => {
    const loading = AuthCallbackLoading();
    const children = Children.toArray(loading.props.children);

    expect(loading.props['aria-label']).toBe('로그인 정보를 불러오는 중');
    expect(children.some((child) => isValidElement(child) && child.type === Skeleton)).toBe(true);
  });
});
