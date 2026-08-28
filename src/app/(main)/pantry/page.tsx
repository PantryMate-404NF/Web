import { PantryFlowPage } from '@/views/pantry/ui/pantry-flow-page';

interface PantryRouteProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function PantryRoute({ searchParams }: PantryRouteProps) {
  const { state } = await searchParams;

  return <PantryFlowPage state={state} />;
}
