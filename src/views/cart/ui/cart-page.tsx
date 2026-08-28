import { CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getCartTotal, cartItemMocks } from '@/entities/cart/model/mock';
import { MobileScreen } from '@/widgets/app-shell/ui/mobile-screen';
import { CartItemRow } from '@/widgets/cart/ui/cart-item-row';

interface CartPageProps {
  from?: string;
}

export function getCartNotice(from?: string) {
  return from === 'recipe' ? '레시피 부족 재료가 담겼어요' : '장바구니에 담은 상품이에요';
}

export function CartPage({ from }: CartPageProps) {
  const total = getCartTotal();

  return (
    <MobileScreen backHref="/recipe" title="장바구니">
      <section className="bg-muted mt-5 flex items-center gap-3 rounded-2xl p-4">
        <Truck aria-hidden="true" className="text-primary size-5" />
        <p className="text-sm font-medium">{getCartNotice(from)}</p>
      </section>
      <section className="mt-5">
        <h2 className="text-sm font-semibold">상품 {cartItemMocks.length}개</h2>
        <div className="mt-2">
          {cartItemMocks.map((item) => (
            <CartItemRow item={item} key={item.id} />
          ))}
        </div>
      </section>
      <section className="bg-card mt-6 rounded-2xl border p-4">
        <h2 className="text-base font-semibold">결제 예상 금액</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">상품 금액</dt>
            <dd>{total.toLocaleString()}원</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">배송비</dt>
            <dd>0원</dd>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-semibold">
            <dt>총 결제 금액</dt>
            <dd>{total.toLocaleString()}원</dd>
          </div>
        </dl>
      </section>
      <Button asChild className="mt-8 h-12 w-full">
        <Link href="/pantry?state=delivery-complete">
          <CreditCard aria-hidden="true" />
          {total.toLocaleString()}원 주문하기
        </Link>
      </Button>
      <p className="text-muted-foreground mt-3 text-center text-xs">
        목업에서는 주문 완료 후 배송 완료 자동 등록 화면으로 이동합니다.
      </p>
    </MobileScreen>
  );
}
