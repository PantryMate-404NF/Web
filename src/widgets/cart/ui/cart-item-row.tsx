import { Minus, Plus } from 'lucide-react';

import type { CartItem } from '@/entities/cart/model/types';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  return (
    <article className="bg-card flex gap-3 border-b py-4">
      <div
        aria-label={`${item.name} 이미지 자리`}
        className="bg-muted text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-xl text-xs"
        role="img"
      >
        상품
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs">레시피 부족 재료</p>
        <h2 className="mt-1 text-sm font-medium">{item.name}</h2>
        <p className="mt-1 text-sm font-semibold">{item.price.toLocaleString()}원</p>
        <div className="mt-3 flex items-center justify-between">
          <div
            aria-label={`${item.name} 수량 1`}
            className="flex items-center gap-3 rounded-lg border px-2 py-1 text-sm"
          >
            <Minus aria-hidden="true" className="size-3" />
            <span>1</span>
            <Plus aria-hidden="true" className="size-3" />
          </div>
          <span className="text-muted-foreground text-xs">{item.quantityLabel}</span>
        </div>
      </div>
    </article>
  );
}
