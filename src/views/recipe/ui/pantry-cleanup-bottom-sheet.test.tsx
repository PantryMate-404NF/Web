import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
  getPantryCleanupSuccessMessage,
  getPantryCleanupVisibleItems,
  PantryCleanupBottomSheet,
} from './pantry-cleanup-bottom-sheet';

const pantryItems = [
  {
    pantryItemId: 21,
    name: '토마토',
    imageUrl: 'https://cdn.example.test/tomato.jpg',
  },
  { pantryItemId: 22, name: '달걀', imageUrl: null },
];
const eightPantryItems = Array.from({ length: 8 }, (_, index) => ({
  pantryItemId: index + 1,
  name: `재료 ${index + 1}`,
  imageUrl: null,
}));

describe('PantryCleanupBottomSheet', () => {
  it('renders pantry ingredients as selectable Figma cards with defer and cleanup actions', () => {
    const markup = renderToStaticMarkup(
      <PantryCleanupBottomSheet
        errorMessage={null}
        isSubmitting={false}
        items={pantryItems}
        onCleanup={vi.fn()}
        onDefer={vi.fn()}
        onToggle={vi.fn()}
        selectedItemIds={[21]}
      />,
    );

    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('data-state="open"');
    expect(markup).toContain('aria-modal="true"');
    expect(markup).toContain('bg-[var(--primitive-black)]/70');
    expect(markup).toContain('요리 완성! 🎉');
    expect(markup).toContain('사용한 식재료를 정리할까요?');
    expect(markup).toContain('aria-label="토마토 선택" aria-pressed="true"');
    expect(markup).toContain('aria-label="달걀 선택" aria-pressed="false"');
    expect(markup).toContain('recipe-cleanup-check-selected.svg');
    expect(markup).toContain('recipe-cleanup-check-unselected.svg');
    expect(markup).toContain('z-10');
    expect(markup).toContain('https://cdn.example.test/tomato.jpg');
    expect(markup).toContain('ingredient-image-placeholder.png');
    expect(markup).toContain('나중에');
    expect(markup).toContain('정리하기');
  });

  it('keeps cleanup disabled until at least one pantry ingredient is selected', () => {
    const markup = renderToStaticMarkup(
      <PantryCleanupBottomSheet
        errorMessage={null}
        isSubmitting={false}
        items={pantryItems}
        onCleanup={vi.fn()}
        onDefer={vi.fn()}
        onToggle={vi.fn()}
        selectedItemIds={[]}
      />,
    );

    expect(markup).toMatch(/>정리하기<\/button>/);
    expect(markup).toMatch(/disabled=""[^>]*>정리하기<\/button>/);
  });

  it('shows an empty message and disables cleanup when the recipe has no matched pantry items', () => {
    const markup = renderToStaticMarkup(
      <PantryCleanupBottomSheet
        errorMessage={null}
        isSubmitting={false}
        items={[]}
        onCleanup={vi.fn()}
        onDefer={vi.fn()}
        onToggle={vi.fn()}
        selectedItemIds={[]}
      />,
    );

    expect(markup).toContain('정리할 팬트리 재료가 없어요.');
    expect(markup).toMatch(/disabled=""[^>]*>정리하기<\/button>/);
  });

  it('uses the number of successfully selected items in the cleanup toast', () => {
    expect(getPantryCleanupSuccessMessage(3)).toBe('총 3개의 식재료가 삭제되었어요.');
  });

  it('keeps the sheet at 482px without the full-height mobile-page minimum', () => {
    const markup = renderToStaticMarkup(
      <PantryCleanupBottomSheet
        errorMessage={null}
        isSubmitting={false}
        items={pantryItems}
        onCleanup={vi.fn()}
        onDefer={vi.fn()}
        onToggle={vi.fn()}
        selectedItemIds={[]}
      />,
    );

    expect(markup).toContain('h-[482px]');
    expect(markup).toContain('shrink-0');
    expect(markup).not.toContain('mobile-page');
  });

  it('initially shows up to six ingredients with a more action', () => {
    const markup = renderToStaticMarkup(
      <PantryCleanupBottomSheet
        errorMessage={null}
        isSubmitting={false}
        items={eightPantryItems}
        onCleanup={vi.fn()}
        onDefer={vi.fn()}
        onToggle={vi.fn()}
        selectedItemIds={[]}
      />,
    );

    expect(markup).toContain('더보기 (2개)');
    expect(markup).toContain('재료 6');
    expect(markup).not.toContain('재료 7');
  });

  it('shows all ingredients after expansion and only the first six before expansion', () => {
    expect(getPantryCleanupVisibleItems(eightPantryItems, false)).toHaveLength(6);
    expect(getPantryCleanupVisibleItems(eightPantryItems, true)).toHaveLength(8);
    expect(getPantryCleanupVisibleItems(eightPantryItems.slice(0, 6), false)).toHaveLength(6);
  });
});
