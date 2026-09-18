'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
}

export function hasPreviousHistoryEntry(historyLength: number): boolean {
  return historyLength > 1;
}

export function BackButton({ fallbackHref = '/', label = '이전 페이지로 이동' }: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (hasPreviousHistoryEntry(window.history.length)) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      aria-label={label}
      className="focus-visible:ring-ring grid size-10 place-items-center rounded-full focus-visible:ring-2"
      onClick={handleClick}
      type="button"
    >
      <ArrowLeft aria-hidden="true" className="size-6" />
    </button>
  );
}
