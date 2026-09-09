/**
 * 하단 네비게이션의 순서·경로·현재 경로별 Figma 아이콘 상태를 정의합니다.
 */
export type BottomNavigationItemId = 'recipe' | 'pantry' | 'home' | 'search' | 'mypage';

interface BottomNavigationDefinition {
  id: BottomNavigationItemId;
  href?: string;
  label: string;
}

export interface BottomNavigationItem extends BottomNavigationDefinition {
  iconSrc: string;
  isActive: boolean;
}

export interface BottomNavigationOptions {
  isAuthenticated?: boolean;
}

/** 하단 네비게이션의 Figma spacing·typography 규칙입니다. */
export const BOTTOM_NAVIGATION_LAYOUT = {
  itemGapClassName: 'gap-1',
  itemPaddingClassName: 'py-2',
  labelClassName: 'text-xs font-medium',
  navigationPaddingClassName: 'px-4',
} as const;

const navigationDefinitions: readonly BottomNavigationDefinition[] = [
  { id: 'recipe', href: '/recipe', label: '레시피' },
  { id: 'pantry', href: '/pantry', label: '팬트리' },
  { id: 'home', href: '/', label: '홈' },
  { id: 'search', href: '/search', label: '검색' },
  { id: 'mypage', href: '/mypage', label: '마이페이지' },
];

const loginRequiredItemIds = new Set<BottomNavigationItemId>(['pantry', 'mypage']);

function isCurrentPath(item: BottomNavigationDefinition, pathname: string): boolean {
  if (!item.href) return false;

  return item.href === '/'
    ? pathname === '/'
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getBottomNavigationItems(
  pathname: string,
  { isAuthenticated = true }: BottomNavigationOptions = {},
): BottomNavigationItem[] {
  return navigationDefinitions.map((item) => {
    const isActive = isCurrentPath(item, pathname);
    const href = !isAuthenticated && loginRequiredItemIds.has(item.id) ? '/login' : item.href;

    return {
      ...item,
      href,
      iconSrc: `/icons/navigation/${item.id}-${isActive ? 'fill' : 'line'}.svg`,
      isActive,
    };
  });
}
