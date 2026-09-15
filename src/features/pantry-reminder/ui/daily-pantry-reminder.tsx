'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import {
  getLocalDateKey,
  getMillisecondsUntilNextReminder,
  isPantryReminderPreviewEnabled,
  PANTRY_REMINDER_STORAGE_KEY,
  resolveReminderShownDate,
  shouldShowDailyPantryReminder,
} from '../model/daily-pantry-reminder';

interface PantryReminderDialogProps {
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function PantryReminderDialog({
  closeButtonRef,
  dialogRef,
  onClose,
}: PantryReminderDialogProps) {
  return (
    <div
      aria-describedby="pantry-reminder-description"
      aria-labelledby="pantry-reminder-title"
      aria-modal={true}
      className="absolute top-[calc(50%-71px)] left-1/2 flex w-[308px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-[20px] py-8 [background:var(--surface-reminder)]"
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      <div className="flex w-full flex-col items-center gap-[18px]">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <h2 className="text-title-3 font-bold" id="pantry-reminder-title">
            팬트리 확인 시간이에요!
          </h2>
          <p
            className="text-text-secondary text-base leading-6 font-medium"
            id="pantry-reminder-description"
          >
            식재료 상태를 확인하고
            <br />
            필요한 정보를 업데이트 해주세요
          </p>
        </div>
        <Image
          alt="식재료 바구니를 든 팬트리메이트 캐릭터"
          height={168}
          priority
          src="/images/home/pantry-reminder.png"
          width={190}
        />
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        <button
          className="focus-visible:ring-ring flex h-[51px] w-[130px] items-center justify-center rounded-full text-base leading-6 font-semibold [color:var(--primitive-primary-700)] [background:var(--primitive-primary-200)] focus-visible:ring-2"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          닫기
        </button>
        <Link
          className="bg-primary text-primary-foreground focus-visible:ring-ring flex h-[51px] w-[130px] items-center justify-center rounded-full text-base leading-6 font-semibold focus-visible:ring-2"
          href="/pantry?state=complete"
          onClick={onClose}
        >
          팬트리로 이동
        </Link>
      </div>
    </div>
  );
}

let inMemoryLastShownDate: string | null = null;

function readLastShownDate() {
  let storedDate: string | null = null;

  try {
    storedDate = window.localStorage.getItem(PANTRY_REMINDER_STORAGE_KEY);
  } catch {
    // Fall back to the current tab's memory when storage is unavailable.
  }

  return resolveReminderShownDate(storedDate, inMemoryLastShownDate);
}

function markReminderAsShown(now: Date) {
  inMemoryLastShownDate = getLocalDateKey(now);

  try {
    window.localStorage.setItem(PANTRY_REMINDER_STORAGE_KEY, inMemoryLastShownDate);
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }
}

interface DailyPantryReminderProps {
  forceOpen?: boolean;
  isEligible: boolean;
}

export function DailyPantryReminder({ forceOpen = false, isEligible }: DailyPantryReminderProps) {
  const isPreviewEnabled = isPantryReminderPreviewEnabled(process.env.NODE_ENV, forceOpen);
  const [isOpen, setIsOpen] = useState(isPreviewEnabled);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isEligible || isPreviewEnabled) return;

    let timeoutId: number | undefined;

    const showIfDue = () => {
      const now = new Date();

      if (!shouldShowDailyPantryReminder(now, readLastShownDate())) return;

      previousFocusRef.current = document.activeElement as HTMLElement | null;
      markReminderAsShown(now);
      setIsOpen(true);
    };

    const scheduleNextReminder = () => {
      timeoutId = window.setTimeout(
        () => {
          showIfDue();
          scheduleNextReminder();
        },
        getMillisecondsUntilNextReminder(new Date()) + 50,
      );
    };

    const initialCheckId = window.setTimeout(showIfDue, 0);
    scheduleNextReminder();

    const handleVisibilityChange = () => {
      if (!document.hidden) showIfDue();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(initialCheckId);
      window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isEligible, isPreviewEnabled]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current ??= document.activeElement as HTMLElement | null;
    const animationFrame = window.requestAnimationFrame(() => dialogRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        window.requestAnimationFrame(() => previousFocusRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href]',
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const closeReminder = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  };

  if (!isOpen) return null;

  return (
    <div className="bg-overlay/80 fixed inset-y-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2">
      <PantryReminderDialog
        closeButtonRef={closeButtonRef}
        dialogRef={dialogRef}
        onClose={closeReminder}
      />
    </div>
  );
}
