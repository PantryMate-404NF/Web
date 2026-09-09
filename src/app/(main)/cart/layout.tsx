/** 장바구니 화면만 iPhone 안전 영역을 포함한 전체 기기 프레임으로 렌더링합니다. */
import type { Viewport } from 'next';

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
