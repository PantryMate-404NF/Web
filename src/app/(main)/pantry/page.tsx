/**
 * /pantry 주소의 페이지 진입점.
 * URL query를 해석해 FSD 페이지 레이어로 전달합니다.
 */

import { PantryRouteContent } from '@/views/pantry/ui/pantry-route-content';
import { PantryFlowPage } from '@/views/pantry/ui/pantry-flow-page';

interface PantryRouteProps {
  searchParams: Promise<{ state?: string; view?: string }>;
}

export default async function PantryRoute({ searchParams }: PantryRouteProps) {
  const { state, view } = await searchParams;

  if (state) return <PantryFlowPage state={state} view={view} />;

  return <PantryRouteContent view={view} />;
}
