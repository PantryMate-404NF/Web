/**
 * /pantry 주소의 페이지 진입점.
 * 목업 단계에서는 기본 주소에서도 가득 찬 팬트리 화면을 제공합니다.
 */

import { PantryFlowPage } from '@/views/pantry/ui/pantry-flow-page';

interface PantryRouteProps {
  searchParams: Promise<{ id?: string; state?: string; view?: string }>;
}

export default async function PantryRoute({ searchParams }: PantryRouteProps) {
  const { id, state, view } = await searchParams;

  if (state) return <PantryFlowPage itemId={id} state={state} view={view} />;

  return <PantryFlowPage state="full" view={view} />;
}
