import { Children, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { focusInitialDialogControl, PantryReminderDialog } from './daily-pantry-reminder';

describe('PantryReminderDialog', () => {
  it('피그마 크기와 접근 가능한 대화상자 의미를 제공한다', () => {
    const dialog = PantryReminderDialog({
      closeButtonRef: { current: null },
      dialogRef: { current: null },
      onClose: vi.fn(),
    });

    expect(dialog.props.role).toBe('dialog');
    expect(dialog.props['aria-modal']).toBe(true);
    expect(dialog.props.tabIndex).toBe(-1);
    expect(dialog.props.className).toContain('w-[308px]');

    const actions = Children.toArray(dialog.props.children).at(-1);
    expect(isValidElement(actions)).toBe(true);
  });

  it('팬트리 이동 URL에 로그인 상태 쿼리를 추가하지 않는다', () => {
    const markup = renderToStaticMarkup(
      PantryReminderDialog({
        closeButtonRef: { current: null },
        dialogRef: { current: null },
        onClose: vi.fn(),
      }),
    );

    expect(markup).toContain('href="/pantry"');
    expect(markup).not.toContain('state=complete');
  });
});

describe('focusInitialDialogControl', () => {
  it('대화상자가 열리면 닫기 버튼에 초기 포커스를 이동한다', () => {
    const focus = vi.fn();

    focusInitialDialogControl({ current: { focus } as unknown as HTMLButtonElement });

    expect(focus).toHaveBeenCalledOnce();
  });
});
