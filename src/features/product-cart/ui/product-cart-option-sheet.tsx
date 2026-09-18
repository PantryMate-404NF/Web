import Image from 'next/image';
import type { RefObject } from 'react';

import type { ProductDetail, ProductOption } from '@/entities/product/model/types';
import type { ProductOptionQuantities } from '@/features/product-cart/model/product-cart-selection';

interface ProductCartOptionSheetProps {
  dialogRef?: RefObject<HTMLElement | null>;
  onAdd: () => void;
  onClose: () => void;
  onQuantityChange: (optionId: string, amount: number) => void;
  product: ProductDetail;
  quantities: ProductOptionQuantities;
}

function getProductOptions(product: ProductDetail): ProductOption[] {
  return product.options ?? [{ id: 'default', label: product.weight, price: product.price }];
}

export function ProductCartOptionSheet({
  dialogRef,
  onAdd,
  onClose,
  onQuantityChange,
  product,
  quantities,
}: ProductCartOptionSheetProps) {
  const options = getProductOptions(product);
  const selectedCount = Object.values(quantities).reduce((total, quantity) => total + quantity, 0);

  return (
    <div
      className="bg-overlay/80 fixed inset-0 z-30 flex items-end justify-center"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      role="presentation"
    >
      <section
        aria-label={`${product.name} 옵션 선택`}
        aria-modal="true"
        className="bg-card flex w-full max-w-[var(--layout-mobile-design-frame)] flex-col gap-2 overflow-hidden rounded-t-[20px] pt-4 pb-[max(40px,env(safe-area-inset-bottom))] outline-none"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex h-[34px] items-start justify-center" aria-hidden="true">
          <span className="bg-foreground mt-2 h-[5px] w-20 rounded-full" />
        </div>

        <div>
          <div className="border-border flex items-center gap-3 border-b px-4 pb-4">
            <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-[8px]">
              {(product.thumbnailUrl ?? product.imageUrl) ? (
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="64px"
                  src={product.thumbnailUrl ?? product.imageUrl ?? ''}
                />
              ) : null}
            </div>
            <div className="w-72 shrink-0">
              <h2 className="truncate text-[15px] leading-[23px] font-medium">{product.name}</h2>
              <p className="mt-1 text-[18px] leading-[25px] font-bold">
                {product.price.toLocaleString()}원
              </p>
            </div>
          </div>

          <ul className="space-y-2 px-4 py-4">
            {options.map((option) => {
              const quantity = quantities[option.id] ?? 0;
              const isSelected = quantity > 0;

              return (
                <li
                  className={`flex items-center justify-between rounded-[10px] border px-4 py-2 ${
                    isSelected ? 'border-primary h-[66px] border-[1.5px]' : 'border-border h-[65px]'
                  }`}
                  key={option.id}
                  style={isSelected ? { borderColor: 'var(--primary)' } : undefined}
                >
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[15px] leading-[23px] ${isSelected ? 'text-foreground' : 'text-text-secondary'}`}
                    >
                      {option.label}
                    </p>
                    <p className="text-title-4 font-semibold">{option.price.toLocaleString()}원</p>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <button
                      aria-label={`${option.label} 수량 줄이기`}
                      className="bg-surface-secondary focus-visible:ring-ring grid size-7 place-items-center rounded-[8px] outline-none focus-visible:ring-2 disabled:opacity-50"
                      disabled={quantity === 0}
                      onClick={() => onQuantityChange(option.id, -1)}
                      type="button"
                    >
                      <Image alt="" height={20} src="/icons/product/minus-line.svg" width={20} />
                    </button>
                    <span
                      aria-label={`${option.label} 수량 ${quantity}`}
                      className="w-9 text-center text-sm"
                    >
                      {quantity}
                    </span>
                    <button
                      aria-label={`${option.label} 수량 늘리기`}
                      className="bg-surface-selected text-surface-selected-foreground focus-visible:ring-ring grid size-7 place-items-center rounded-[8px] outline-none focus-visible:ring-2"
                      onClick={() => onQuantityChange(option.id, 1)}
                      type="button"
                    >
                      <Image alt="" height={20} src="/icons/product/plus-line.svg" width={20} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="px-4">
          <button
            className="bg-primary text-primary-foreground focus-visible:ring-ring h-[60px] w-full rounded-xl text-lg font-semibold focus-visible:ring-2 disabled:opacity-50"
            disabled={selectedCount === 0}
            onClick={onAdd}
            type="button"
          >
            장바구니 담기
          </button>
        </div>
      </section>
    </div>
  );
}
