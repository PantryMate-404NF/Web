import { AppEntryPage } from '@/views/splash/ui/app-entry-page';

export default async function HomeRoute({
  searchParams,
}: {
  searchParams: Promise<{ reminder?: string }>;
}) {
  const { reminder } = await searchParams;
  const forceReminder = process.env.NODE_ENV === 'development' && reminder === '1';

  return <AppEntryPage forceReminder={forceReminder} />;
}
