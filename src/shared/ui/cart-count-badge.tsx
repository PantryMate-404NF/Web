export function CartCountBadge({ count }: { count: number }) {
  if (count < 1) return null;

  return (
    <span
      aria-hidden="true"
      className="text-caption absolute top-0 right-0 grid size-[14px] place-items-center rounded-full bg-[var(--primitive-grey-800)] font-medium text-[var(--primitive-white)]"
    >
      {count}
    </span>
  );
}
