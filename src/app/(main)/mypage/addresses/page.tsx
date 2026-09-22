import { getSafeOrderReturnTo } from '@/entities/address/model/address';
import { AddressListRouteContent } from '@/views/mypage/ui/address-list-route-content';

type AddressListRouteProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function AddressListRoute({ searchParams }: AddressListRouteProps) {
  const { returnTo } = await searchParams;

  return (
    <AddressListRouteContent
      returnTo={getSafeOrderReturnTo(typeof returnTo === 'string' ? returnTo : undefined)}
    />
  );
}
