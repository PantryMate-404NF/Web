import { getSafeOrderReturnTo } from '@/entities/address/model/address';
import { AddressFormRouteContent } from '@/views/mypage/ui/address-form-route-content';

type AddressFormRouteProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function AddressFormRoute({ searchParams }: AddressFormRouteProps) {
  const { returnTo } = await searchParams;

  return (
    <AddressFormRouteContent
      returnTo={getSafeOrderReturnTo(typeof returnTo === 'string' ? returnTo : undefined)}
    />
  );
}
