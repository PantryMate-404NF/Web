import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { recipeMocks } from '@/entities/recipe/model/mock';

import {
  ImminentIngredientChips,
  RECIPE_ACTION_LAYOUT,
  RecipeActionIcon,
  RecipeCard,
} from './recipe-list-page';

describe('RecipeActionIcon', () => {
  it('shows the Figma bookmark affordance without making it a list-page save action', () => {
    const markup = renderToStaticMarkup(<RecipeCard recipe={recipeMocks[0]} />);

    expect(markup).toContain('lucide-bookmark');
    expect(markup).not.toContain('<button');
    expect(markup).toContain('right-2.5');
    expect(markup).toContain('bg-card/80');
  });

  it('renders an expiration-imminent alert card when the pantry has imminent ingredients', () => {
    const markup = renderToStaticMarkup(
      <ImminentIngredientChips ingredients={[{ name: '돼지고기', daysLeft: 5 }]} />,
    );

    expect(markup).toContain('돼지고기');
    expect(markup).toContain('D-5');
    expect(markup).toContain('기한 임박 식재료가 있어요!');
    expect(markup).toContain('팬트리메이트가 활용할 수 있는 레시피를 추천해 드릴게요.');
  });

  it('renders regular pantry ingredients as chips without the expiration-imminent alert', () => {
    const markup = renderToStaticMarkup(
      <ImminentIngredientChips
        ingredients={[{ name: '돼지고기', daysLeft: 5 }]}
        showAlert={false}
      />,
    );

    expect(markup).toContain('돼지고기');
    expect(markup).toContain('D-5');
    expect(markup).not.toContain('기한 임박 식재료가 있어요!');
    expect(markup).toContain('border-[var(--primitive-grey-300)]');
    expect(markup).toContain('bg-card');
  });

  it('renders the grey-600 chevron used by recipe action links', () => {
    const markup = renderToStaticMarkup(<RecipeActionIcon />);

    expect(markup).toContain('lucide-chevron-right');
    expect(markup).toContain('text-[var(--primitive-grey-600)]');
  });

  it('uses the Figma action area height and text-to-icon overlap', () => {
    expect(RECIPE_ACTION_LAYOUT.containerClassName).toContain('h-[60px]');
    expect(RECIPE_ACTION_LAYOUT.containerClassName).toContain('pb-5');
    expect(RECIPE_ACTION_LAYOUT.textClassName).toContain('-mr-1.5');
    expect(RECIPE_ACTION_LAYOUT.sectionHeaderClassName).toContain('-mr-4');
    expect(RECIPE_ACTION_LAYOUT.titleBlockClassName).toContain('h-12');
  });

  it('keeps the pantry recipe action in its own 40px header with an 8px panel gap', () => {
    expect(RECIPE_ACTION_LAYOUT.topHeaderClassName).toContain('h-10');
    expect(RECIPE_ACTION_LAYOUT.topActionClassName).not.toContain('pb-5');
    expect(RECIPE_ACTION_LAYOUT.topPanelClassName).toContain('mt-2');
  });
});
