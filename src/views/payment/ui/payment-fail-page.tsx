import Link from 'next/link';

export function PaymentFailPage({ code }: { code?: string }) {
  const isCanceled = code === 'PAY_PROCESS_CANCELED';

  return (
    <main className="mobile-page bg-background flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="text-title-2 font-semibold">
        {isCanceled ? '결제가 취소됐어요' : '결제를 진행하지 못했어요'}
      </h1>
      <p className="text-text-secondary mt-2 text-sm">
        {isCanceled ? '주문서에서 다시 결제할 수 있어요.' : '잠시 후 다시 시도해 주세요.'}
      </p>
      <Link
        className="bg-primary text-primary-foreground mt-8 rounded-xl px-6 py-3 font-semibold"
        href="/order"
      >
        주문서로 돌아가기
      </Link>
    </main>
  );
}
