import { describe, expect, it, vi } from 'vitest';

import { pantryItems } from '@/entities/pantry/model/mock';

import { PantryRouteContent } from './pantry-route-content';

const { usePantryQueryMock } = vi.hoisted(() => ({
  usePantryQueryMock: vi.fn(),
}));

vi.mock('../model/use-pantry-query', () => ({
  usePantryQuery: usePantryQueryMock,
}));

describe('PantryRouteContent', () => {
  it('passes pantry query data and request states to PantryPage', () => {
    const refetch = vi.fn();
    usePantryQueryMock.mockReturnValue({
      data: pantryItems,
      error: new Error('팬트리 조회 실패'),
      isPending: false,
      refetch,
    });

    const page = PantryRouteContent({ view: 'icon' });

    expect(page.props).toMatchObject({
      cardVariant: 'icon',
      errorMessage: '팬트리 조회 실패',
      isLoading: false,
      items: pantryItems,
    });

    page.props.onRetry();
    expect(refetch).toHaveBeenCalledOnce();
  });
});
