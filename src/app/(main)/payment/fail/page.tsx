import { PaymentFailPage } from '@/views/payment/ui/payment-fail-page';

interface PaymentFailRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentFailRoute({ searchParams }: PaymentFailRouteProps) {
  const params = await searchParams;

  return <PaymentFailPage code={typeof params.code === 'string' ? params.code : undefined} />;
}
