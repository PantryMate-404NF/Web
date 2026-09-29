import { getSafeOrderReturnTo } from '@/entities/address/model/address';
import { AddressEditRouteContent } from '@/views/mypage/ui/address-edit-route-content';

type AddressEditRouteProps = {
  params: Promise<{ addressId: string }>;
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function AddressEditRoute({ params, searchParams }: AddressEditRouteProps) {
  const [{ addressId }, { returnTo }] = await Promise.all([params, searchParams]);

  return (
    <AddressEditRouteContent
      addressId={addressId}
      returnTo={getSafeOrderReturnTo(typeof returnTo === 'string' ? returnTo : undefined)}
    />
  );
}
