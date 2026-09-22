import { getSafeOrderReturnTo } from '@/entities/address/model/address';
import { AddressFormPage } from '@/views/mypage/ui/address-form-page';

type AddressFormRouteProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function AddressFormRoute({ searchParams }: AddressFormRouteProps) {
  const { returnTo } = await searchParams;

  return (
    <AddressFormPage
      returnTo={getSafeOrderReturnTo(typeof returnTo === 'string' ? returnTo : undefined)}
    />
  );
}
