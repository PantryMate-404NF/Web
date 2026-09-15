import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  COOKING_GUIDE_DELAY_MS,
  COOKING_GUIDE_VISIBLE_MS,
  RecipeDetailPage,
  areAllIngredientsSelected,
  getCleanupDeletionCount,
  getCleanupIngredients,
  getCleanupToastMessage,
  getMatchingPantryIngredients,
  toggleIngredientSelection,
} from './recipe-detail-page';

describe('RecipeDetailPage', () => {
  it('renders the Figma recipe detail content with its local hero image', () => {
    const queryClient = new QueryClient();
    const markup = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <RecipeDetailPage recipeId="tomato-egg-stir-fry" />
      </QueryClientProvider>,
    );

    expect(markup).toContain('토마토 달걀 볶음');
    expect(markup).toContain('필요 재료');
    expect(markup).toContain('조리 순서');
    expect(markup).toContain('조리 완료');
    expect(markup).toContain('tomato-egg-hero.png');
  });

  it('shows each matching pantry item, including duplicate ingredient registrations', () => {
    const cleanupIngredients = getMatchingPantryIngredients(
      [
        { imageSrc: '/images/tomato.png', name: '토마토' },
        { imageSrc: '/images/egg.png', name: '달걀' },
      ],
      [
        {
          id: 'pantry-tomato-1',
          imageAlt: '토마토',
          imageUrl: '/uploads/tomato-1.png',
          name: '토마토',
        },
        { id: 'pantry-tomato-2', imageAlt: '토마토', name: '토마토' },
        { id: 'pantry-sugar-1', imageAlt: '설탕', name: '설탕' },
      ],
    );

    expect(cleanupIngredients).toEqual([
      { id: 'pantry-tomato-1', imageSrc: '/uploads/tomato-1.png', name: '토마토' },
      { id: 'pantry-tomato-2', imageSrc: '/images/tomato.png', name: '토마토' },
    ]);
  });

  it('uses the selected pantry item count in the cleanup confirmation toast', () => {
    expect(getCleanupToastMessage(2)).toBe('총 2개의 식재료가 삭제되었어요.');
    expect(getCleanupToastMessage(0)).toBe('총 0개의 식재료가 삭제되었어요.');
  });

  it('counts every selected recipe ingredient for the cleanup confirmation', () => {
    expect(getCleanupDeletionCount(['egg', 'sugar'])).toBe(2);
  });
});

describe('ingredient selection', () => {
  it('toggles one ingredient and can identify a fully selected ingredient list', () => {
    expect(toggleIngredientSelection([], 'tomato')).toEqual(['tomato']);
    expect(toggleIngredientSelection(['tomato'], 'tomato')).toEqual([]);
    expect(areAllIngredientsSelected(['tomato', 'egg'], ['tomato', 'egg'])).toBe(true);
    expect(areAllIngredientsSelected(['tomato'], ['tomato', 'egg'])).toBe(false);
  });

  it('uses only the identity, name, and image for cleanup cards', () => {
    expect(
      getCleanupIngredients([
        {
          id: 'tomato',
          imageSrc: '/images/tomato.png',
          name: '토마토',
          amount: '2개',
          status: 'available',
          statusLabel: '보유',
        },
      ]),
    ).toEqual([{ id: 'tomato', imageSrc: '/images/tomato.png', name: '토마토' }]);
  });
});

describe('cooking guide timing', () => {
  it('uses a positive delay and keeps the guide visible for ten seconds', () => {
    expect(COOKING_GUIDE_DELAY_MS).toBeGreaterThan(0);
    expect(COOKING_GUIDE_VISIBLE_MS).toBe(10_000);
  });
});
