import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { AccountWithdrawalDialog, focusAccountWithdrawalDialog } from './account-withdrawal-dialog';

describe('AccountWithdrawalDialog', () => {
  it('회원 정보 삭제와 복구 불가 내용을 명시하고 취소 수단을 제공한다', () => {
    const markup = renderToStaticMarkup(
      createElement(AccountWithdrawalDialog, {
        isPending: false,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
      }),
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain('tabindex="-1"');
    expect(markup).toContain('모든 회원 정보가 삭제');
    expect(markup).toContain('복구할 수 없어요');
    expect(markup).toContain('취소');
    expect(markup).toContain('회원 탈퇴');
  });

  it('처리 중에는 중복 실행을 막고 오류를 알린다', () => {
    const markup = renderToStaticMarkup(
      createElement(AccountWithdrawalDialog, {
        errorMessage: '회원 탈퇴에 실패했어요. 다시 시도해 주세요.',
        isPending: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
      }),
    );

    expect(markup).toContain('탈퇴 처리 중');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('회원 탈퇴에 실패했어요. 다시 시도해 주세요.');
  });

  it('처리 중에는 대화상자에, 처리 종료 후에는 취소 버튼에 포커스를 둔다', () => {
    const dialog = { focus: vi.fn() } as unknown as HTMLDivElement;
    const cancelButton = { focus: vi.fn() } as unknown as HTMLButtonElement;

    focusAccountWithdrawalDialog(dialog, cancelButton, true);
    expect(dialog.focus).toHaveBeenCalledOnce();
    expect(cancelButton.focus).not.toHaveBeenCalled();

    focusAccountWithdrawalDialog(dialog, cancelButton, false);
    expect(cancelButton.focus).toHaveBeenCalledOnce();
  });
});
