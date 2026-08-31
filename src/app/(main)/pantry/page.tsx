import { PantryFlowPage } from '@/views/pantry/ui/pantry-flow-page';

interface PantryRouteProps {
  searchParams: Promise<{ state?: string; view?: string }>;
}

export default async function PantryRoute({ searchParams }: PantryRouteProps) {
  const { state, view } = await searchParams;

  return <PantryFlowPage state={state} view={view} />;
}
