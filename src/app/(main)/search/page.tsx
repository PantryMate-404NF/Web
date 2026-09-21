import { SearchPage } from '@/views/search/ui/search-page';

type SearchRouteProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchRoute({ searchParams }: SearchRouteProps) {
  const { q } = await searchParams;

  return <SearchPage initialQuery={typeof q === 'string' ? q : ''} />;
}
