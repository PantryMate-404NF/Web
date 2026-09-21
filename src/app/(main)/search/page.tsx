import { SearchPage } from '@/views/search/ui/search-page';

type SearchRouteProps = {
  searchParams: Promise<{
    q?: string | string[];
    state?: string | string[];
  }>;
};

export default async function SearchRoute({ searchParams }: SearchRouteProps) {
  const { q, state } = await searchParams;
  const initialQuery = typeof q === 'string' ? q : '';
  const previewState =
    process.env.NODE_ENV === 'development' && (state === 'loading' || state === 'error')
      ? state
      : undefined;

  return (
    <SearchPage
      initialQuery={initialQuery}
      key={`${initialQuery}:${previewState ?? 'default'}`}
      previewState={previewState}
    />
  );
}
