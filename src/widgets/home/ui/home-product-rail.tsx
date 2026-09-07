interface HomeProductRailProps {
  description?: string;
  title: string;
}

const products = ['에버콜드산 달콤 바나나', '신선한 우유', '부드러운 두부'];

export function HomeProductRail({ description, title }: HomeProductRailProps) {
  return (
    <section className="px-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-label-3 font-semibold">{title}</h2>
          {description ? (
            <p className="text-label-4 text-muted-foreground mt-0.5">{description}</p>
          ) : null}
        </div>
        <a className="text-label-4 text-muted-foreground" href="#more">
          더보기 <span aria-hidden="true">›</span>
        </a>
      </div>
      <div className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1">
        {products.map((product) => (
          <article className="w-[120px] shrink-0" key={product}>
            <div
              aria-label={`${product} 이미지`}
              className="bg-muted h-[116px] rounded"
              role="img"
            />
            <p className="text-label-4 text-muted-foreground mt-2 truncate">{product}</p>
            <p className="mt-0.5 text-xs font-semibold">3,480원</p>
            <p className="text-label-4 text-muted-foreground mt-0.5">100g당 580원</p>
            <span className="text-label-4 text-muted-foreground mt-1 inline-flex rounded border px-1.5 py-0.5">
              4만원 이상 무료배송
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
