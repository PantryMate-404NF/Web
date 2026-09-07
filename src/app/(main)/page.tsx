import { HomePage } from '@/views/home/ui/home-page';

interface HomeRouteProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function HomeRoute({ searchParams }: HomeRouteProps) {
  const { state } = await searchParams;

  return <HomePage state={state} />;
}
