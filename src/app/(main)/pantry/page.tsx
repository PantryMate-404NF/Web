/**
 * /pantry 주소의 페이지 진입점.
 * URL query를 해석해 FSD 페이지 레이어로 전달합니다.
 */

import { PantryRouteContent } from '@/views/pantry/ui/pantry-route-content';

interface PantryRouteProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function PantryRoute({ searchParams }: PantryRouteProps) {
  const { view } = await searchParams;

  return <PantryRouteContent view={view} />;
}
