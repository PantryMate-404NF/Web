import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { pantryItems } from '@/entities/pantry/model/mock';
import { toPantryItem } from '@/entities/pantry/api/pantry.mapper';

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
  it('displays automatically registered purchases as 자사몰에서 구입', () => {
    const item = toPantryItem({
      pantryItemId: 1,
      ingredientName: '결제 상품',
      sellByDate: null,
      expiryDate: null,
      dDay: null,
      expiryStatus: 'NORMAL',
      storageType: 'ROOM_TEMP',
      isExpiryAutoCalculated: false,
      isCookable: true,
      registerType: 'AUTO',
      imageUrl: null,
    });
    const markup = renderToStaticMarkup(createElement(PantryItemCard, { item, variant: 'image' }));

    expect(markup).toContain('실온');
    expect(markup).toContain('자사몰에서 구입');
  });

  it.each([
    ['AUTO', '자사몰에서 구입'],
    ['MANUAL', '사용자 등록'],
    ['OCR', '영수증 등록'],
  ] as const)('displays %s pantry entries as %s', (registerType, expectedLabel) => {
    const item = toPantryItem({
      pantryItemId: 1,
      ingredientName: '결제 상품',
      sellByDate: null,
      expiryDate: null,
      dDay: null,
      expiryStatus: 'NORMAL',
      storageType: 'REFRIGERATED',
      isExpiryAutoCalculated: false,
      isCookable: true,
      registerType,
      imageUrl: null,
    });
    const markup = renderToStaticMarkup(createElement(PantryItemCard, { item, variant: 'image' }));

    expect(markup).toContain(expectedLabel);
  });

  it('highlights a D-3 badge even when the API status is NORMAL', () => {
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, {
        item: {
          ...pantryItems[0],
          daysUntilExpiration: 3,
          expirationLabel: '소비기한 3일 남음',
          expirationStatus: 'NORMAL',
        },
        variant: 'image',
      }),
    );

    expect(markup).toContain('bg-primary/20 text-status-warning');
  });

  it('uses the pantry basic thumbnail when a manually registered item has no photo', () => {
    const itemWithoutImage = { ...pantryItems[0], imageUrl: undefined };
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, { item: itemWithoutImage, variant: 'image' }),
    );

    expect(markup).toContain('/images/pantry/pantry-basic.svg');
  });

  it('highlights a selected card in recipe selection mode', () => {
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, {
        item: pantryItems[0],
        variant: 'image',
        selectionMode: true,
        selected: true,
      }),
    );

    expect(markup).toContain('border-[#FFCD55]');
    expect(markup).toContain('bg-[#FAE9C2]');
    expect(markup).toContain('aria-pressed="true"');
  });

  it('keeps the edit/delete options available in recipe selection mode', () => {
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, {
        item: pantryItems[0],
        variant: 'image',
        selectionMode: true,
        selected: true,
      }),
    );

    expect(markup).toContain(`aria-label="${pantryItems[0].name} 옵션"`);
    expect(markup).toContain('/images/pantry/dots.svg');
  });

  it('keeps an unavailable but recipe-mapped pantry card selectable', () => {
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, {
        item: { ...pantryItems[0], availability: 'UNAVAILABLE', ingredientId: 44 },
        variant: 'image',
        selectionMode: true,
        selectionIngredientId: 44,
      }),
    );

    expect(markup).toContain('role="button"');
    expect(markup).toContain('aria-disabled="false"');
  });

  it('keeps a pantry card clickable in recipe selection mode without a mapped ingredient ID', () => {
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, {
        item: { ...pantryItems[0], ingredientId: null },
        variant: 'image',
        selectionMode: true,
        selectionIngredientId: null,
      }),
    );

    expect(markup).toContain('role="button"');
    expect(markup).toContain('aria-disabled="false"');
    expect(markup).not.toContain('aria-disabled="true"');
  });

  it('renders uploaded server images directly without the Next image optimizer', () => {
    const imageUrl = 'http://localhost:8080/api/pantry-items/images/tomato.jpg';
    const markup = renderToStaticMarkup(
      createElement(PantryItemCard, {
        item: { ...pantryItems[0], imageUrl },
        variant: 'image',
      }),
    );

    expect(markup).toContain(imageUrl);
    expect(markup).not.toContain('srcSet=');
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
