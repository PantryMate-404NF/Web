export type IngredientAvailabilityStatus = 'all-owned' | 'partially-owned' | 'imminent' | 'none';

const availabilityStyles: Record<
  IngredientAvailabilityStatus,
  { className: string; label: string }
> = {
  'all-owned': {
    className: 'bg-[var(--primitive-grey-700)] text-[var(--primitive-white)]',
    label: '전체 보유',
  },
  'partially-owned': {
    className: 'bg-[var(--primitive-secondary-300)] text-[var(--primitive-secondary-800)]',
    label: '일부 보유',
  },
  imminent: {
    className: 'bg-[var(--primitive-warning-100)] text-[var(--primitive-warning-500)]',
    label: '기한 임박',
  },
  none: {
    className: 'bg-[var(--primitive-error-100)] text-[var(--primitive-error-500)]',
    label: '식재료 없음',
  },
};

/** 레시피를 만들 때 필요한 식재료의 보유 상태를 표시합니다. */
export function IngredientAvailabilityBadge({ status }: { status: IngredientAvailabilityStatus }) {
  const { className, label } = availabilityStyles[status];

  return (
    <span
      className={`text-body-4 inline-flex h-7 items-center justify-center rounded-full px-2 leading-[1.5] font-semibold whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}
