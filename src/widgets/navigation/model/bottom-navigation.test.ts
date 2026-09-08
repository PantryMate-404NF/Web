/**
 * 하단 네비게이션 항목이 현재 경로에 맞는 outline·filled 아이콘을 선택하는지 검증합니다.
 */
import { describe, expect, it } from 'vitest';

import { BOTTOM_NAVIGATION_LAYOUT, getBottomNavigationItems } from './bottom-navigation';

describe('getBottomNavigationItems', () => {
  it('모든 탭에 아이콘·텍스트 간격 4px과 xs·medium 라벨 기준을 제공한다', () => {
    expect(BOTTOM_NAVIGATION_LAYOUT).toEqual({
      itemGapClassName: 'gap-1',
      itemPaddingClassName: 'py-2',
      labelClassName: 'text-xs font-medium',
      navigationPaddingClassName: 'px-4',
    });
  });

  it('현재 팬트리 경로에는 filled 아이콘을 선택한다', () => {
    const pantryItem = getBottomNavigationItems('/pantry').find((item) => item.id === 'pantry');

    expect(pantryItem).toMatchObject({
      href: '/pantry',
      iconSrc: '/icons/navigation/pantry-fill.svg',
      isActive: true,
      label: '팬트리',
    });
  });

  it('선택되지 않은 탭에는 outline 아이콘을 선택한다', () => {
    const recipeItem = getBottomNavigationItems('/pantry').find((item) => item.id === 'recipe');

    expect(recipeItem).toMatchObject({
      iconSrc: '/icons/navigation/recipe-line.svg',
      isActive: false,
      label: '레시피',
    });
  });

  it('검색과 마이페이지 탭을 각 화면으로 연결한다', () => {
    const items = getBottomNavigationItems('/');

    expect(items.find((item) => item.id === 'search')?.href).toBe('/search');
    expect(items.find((item) => item.id === 'mypage')?.href).toBe('/mypage');
  });

  it('비회원 홈에서는 팬트리와 마이페이지 탭을 로그인 화면으로 연결한다', () => {
    const items = getBottomNavigationItems('/', { isAuthenticated: false });

    expect(items.find((item) => item.id === 'pantry')?.href).toBe('/login');
    expect(items.find((item) => item.id === 'mypage')?.href).toBe('/login');
  });

  it('마이페이지 경로에서는 filled 마이페이지 아이콘을 선택한다', () => {
    const mypageItem = getBottomNavigationItems('/mypage').find((item) => item.id === 'mypage');

    expect(mypageItem).toMatchObject({
      href: '/mypage',
      iconSrc: '/icons/navigation/mypage-fill.svg',
      isActive: true,
      label: '마이페이지',
    });
  });

  it('마이페이지 하위 배송조회 경로에서도 마이페이지 탭을 선택 상태로 유지한다', () => {
    const mypageItem = getBottomNavigationItems('/mypage/delivery').find(
      (item) => item.id === 'mypage',
    );

    expect(mypageItem).toMatchObject({
      iconSrc: '/icons/navigation/mypage-fill.svg',
      isActive: true,
    });
  });
});
