import { Children, isValidElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { PantryReminderDialog } from './daily-pantry-reminder';

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
});
