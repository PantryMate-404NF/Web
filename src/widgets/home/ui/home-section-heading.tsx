import Image from 'next/image';
import Link from 'next/link';

interface HomeSectionHeadingProps {
  description: string;
  descriptionTone?: 'secondary' | 'tertiary';
  href: string;
  title: string;
}

export function HomeSectionHeading({
  description,
  descriptionTone = 'secondary',
  href,
  title,
}: HomeSectionHeadingProps) {
  return (
    <div className="flex h-15 items-center justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-title-3 truncate font-semibold">{title}</h2>
        <p
          className={`${descriptionTone === 'tertiary' ? 'text-text-tertiary' : 'text-text-secondary'} truncate text-[15px] leading-[23px] font-medium`}
        >
          {description}
        </p>
      </div>
      <Link
        className="text-text-secondary focus-visible:ring-ring text-title-4 flex h-15 w-19 shrink-0 items-start gap-0.5 pt-2 font-medium focus-visible:ring-2"
        href={href}
      >
        더보기
        <Image
          alt=""
          aria-hidden="true"
          height={24}
          src="/icons/home/chevron-right.svg"
          width={24}
        />
      </Link>
    </div>
  );
}
