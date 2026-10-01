import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/auth/ui/auth-session-provider', () => ({
  useAuthSession: () => ({ state: 'complete' }),
}));

vi.mock('next/navigation', () => ({ usePathname: () => '/recipe' }));

import { BottomNavigation } from './bottom-navigation';

describe('BottomNavigation', () => {
  it('renders an 80px selected tab pill without a GNB shadow and layers the home indicator above it', () => {
    const markup = renderToStaticMarkup(<BottomNavigation isAuthenticated />);

    expect(markup).toContain('aria-label="주요 메뉴"');
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain('w-20');
    expect(markup).toContain('h-14');
    expect(markup).toContain('bg-[var(--primitive-primary-300)]');
    expect(markup).toContain('bottom-navigation-home-indicator');
    expect(markup).not.toContain('shadow-');
  });
});
