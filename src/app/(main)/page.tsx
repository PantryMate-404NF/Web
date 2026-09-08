import { HomePage } from '@/views/home/ui/home-page';

export default async function HomeRoute({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;

  return <HomePage state={state} />;
}
