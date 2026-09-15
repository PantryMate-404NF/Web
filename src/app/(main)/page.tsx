import { HomePage } from '@/views/home/ui/home-page';

export default async function HomeRoute({
  searchParams,
}: {
  searchParams: Promise<{ reminder?: string }>;
}) {
  const { reminder } = await searchParams;

  const forceReminder = process.env.NODE_ENV === 'development' && reminder === '1';

  return <HomePage forceReminder={forceReminder} />;
}
