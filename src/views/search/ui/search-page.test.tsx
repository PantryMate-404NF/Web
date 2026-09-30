import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { SearchPage } from './search-page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn(), replace: vi.fn() }),
}));

describe('SearchPage', () => {
  it('검색 입력 대신 검색창 전체에 포커스 표시를 적용한다', () => {
    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      createElement(QueryClientProvider, { client: queryClient }, createElement(SearchPage)),
    );

    expect(markup).toContain('focus-within:ring-2');
    expect(markup).toContain('focus-within:ring-ring');
    expect(markup).not.toContain(
      'min-w-0 flex-1 rounded-sm bg-transparent font-medium outline-none focus-visible:ring-2',
    );
  });
});
