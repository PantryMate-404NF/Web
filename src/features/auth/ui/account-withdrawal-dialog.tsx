'use client';

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react';

interface AccountWithdrawalDialogProps {
  errorMessage?: string | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function getFocusableElements(dialog: HTMLElement) {
  return Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function AccountWithdrawalDialog({
  errorMessage,
  isPending,
  onClose,
  onConfirm,
}: AccountWithdrawalDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelButtonRef.current?.focus();

    return () => previousFocus?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !isPending) {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusableElements = getFocusableElements(dialogRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (!firstElement || !lastElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isPending) onClose();
  };

  return (
    <div
      aria-describedby="account-withdrawal-description"
      aria-labelledby="account-withdrawal-title"
      aria-modal="true"
      className="bg-overlay/70 fixed inset-0 z-40 flex items-end"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
      role="dialog"
    >
      <section className="bg-background mx-auto flex w-full max-w-[var(--layout-mobile-design-frame)] flex-col items-center overflow-hidden rounded-t-[20px] pt-4 pb-10">
        <div aria-hidden="true" className="flex h-8 w-full justify-center pt-2">
          <div className="bg-surface-inverse h-[5px] w-20 rounded-[100px]" />
        </div>
        <div className="flex w-full flex-col items-center px-6 pt-5 pb-8 text-center">
          <h2 className="text-lg leading-7 font-semibold" id="account-withdrawal-title">
            정말 탈퇴하시겠어요?
          </h2>
          <p
            className="text-text-secondary mt-1 text-sm leading-5 font-medium"
            id="account-withdrawal-description"
          >
            탈퇴하면 배송지, 개인화 설정 등 모든 회원 정보가 삭제되며
            <br />
            복구할 수 없어요.
          </p>
          {errorMessage ? (
            <p className="text-destructive mt-3 text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
        <div className="grid w-full grid-cols-2 gap-2 px-4">
          <button
            className="bg-surface-disabled text-foreground h-12 rounded-full text-lg leading-7 font-semibold disabled:opacity-60"
            disabled={isPending}
            onClick={onClose}
            ref={cancelButtonRef}
            type="button"
          >
            취소
          </button>
          <button
            aria-label={isPending ? '탈퇴 처리 중' : '회원 탈퇴'}
            className="bg-destructive text-destructive-foreground h-12 rounded-full text-lg leading-7 font-semibold disabled:opacity-60"
            disabled={isPending}
            onClick={onConfirm}
            type="button"
          >
            {isPending ? '탈퇴 처리 중' : '회원 탈퇴'}
          </button>
        </div>
      </section>
    </div>
  );
}
