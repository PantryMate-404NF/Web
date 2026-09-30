'use client';

import Image from 'next/image';

/** 운송장번호를 사용자의 클립보드에 복사합니다. */
export function copyTrackingNumber(trackingNumber: string) {
  return navigator.clipboard.writeText(trackingNumber);
}

export function DeliveryTrackingCopyButton({ trackingNumber }: { trackingNumber: string }) {
  return (
    <button
      aria-label="운송장번호 복사"
      className="absolute top-1/2 left-full ml-1 grid size-6 -translate-y-1/2 place-items-center"
      onClick={() => void copyTrackingNumber(trackingNumber)}
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="h-auto w-4 shrink-0"
        height={18}
        src="/icons/delivery/copy.svg"
        width={18}
      />
    </button>
  );
}
