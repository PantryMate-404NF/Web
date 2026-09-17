import { PaymentSuccessPage } from '@/views/payment/ui/payment-success-page';

interface PaymentSuccessRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentSuccessRoute({ searchParams }: PaymentSuccessRouteProps) {
  const params = await searchParams;

  return (
    <PaymentSuccessPage
      amount={typeof params.amount === 'string' ? params.amount : undefined}
      orderId={typeof params.orderId === 'string' ? params.orderId : undefined}
      paymentKey={typeof params.paymentKey === 'string' ? params.paymentKey : undefined}
    />
  );
}
