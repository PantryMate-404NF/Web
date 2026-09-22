import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { pantryItems } from '@/entities/pantry/model/mock';

import {
  getExpirationBadgeLabel,
  getExpirationStatusLabel,
  PantryItemCard,
} from './pantry-item-card';

describe('getExpirationStatusLabel', () => {
  it('uses the compact expiration badge copy used by the icon card wireframe', () => {
    expect(getExpirationStatusLabel('IMMINENT')).toBe('임박');
  });
});

describe('getExpirationBadgeLabel', () => {
  it('converts a remaining-day label to compact D-day copy', () => {
    expect(getExpirationBadgeLabel('소비기한 3일 남음', 'NORMAL')).toBe('D-3');
    expect(getExpirationBadgeLabel('소비기한 경과', 'EXPIRED')).toBe('경과');
  });
});

describe('PantryItemCard image-card icons', () => {
  it('uses the pantry basic thumbnail when a manually registered item has no photo', () => {
    const itemWithoutImage = { ...pantryItems[0], imageUrl: undefined };
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, { item: itemWithoutImage, variant: 'image' }),
    );

    expect(markup).toContain('/images/pantry/pantry-basic.svg');
  });

  it('uses the pantry SVG assets at their specified dimensions', () => {
    const refrigeratedMarkup = renderToStaticMarkup(
      createElement(PantryItemCard, { item: pantryItems[2], variant: 'image' }),
    );
    const frozenMarkup = renderToStaticMarkup(
      createElement(PantryItemCard, { item: pantryItems[5], variant: 'image' }),
    );
    const roomTemperatureMarkup = renderToStaticMarkup(
      createElement(PantryItemCard, { item: pantryItems[0], variant: 'image' }),
    );

    expect(refrigeratedMarkup).toContain('/images/pantry/dots.svg');
    expect(refrigeratedMarkup).toContain('/images/pantry/refrigerator.svg');
    expect(frozenMarkup).toContain('/images/pantry/snow.svg');
    expect(roomTemperatureMarkup).toContain('/images/pantry/sun.svg');
    expect(refrigeratedMarkup).toContain('width="24"');
    expect(refrigeratedMarkup).toContain('width="13"');
    expect(refrigeratedMarkup).toContain('size-[13px] shrink-0 object-contain');
  });

  it('uses a 24px canvas for the vertical options SVG', () => {
    const dotsSvg = readFileSync(resolve(process.cwd(), 'public/images/pantry/dots.svg'), 'utf8');

    expect(dotsSvg).toContain('<svg width="24" height="24" viewBox="0 0 24 24"');
  });
});
