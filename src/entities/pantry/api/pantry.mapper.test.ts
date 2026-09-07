/**
 * Pantry API DTO가 화면 모델로 변환될 때 소비기한 상태와 표시 문구를 검증합니다.
 */
import { describe, expect, it } from 'vitest';

import type { PantryDto } from './pantry.dto';
import { toPantryItem } from './pantry.mapper';

const basePantryDto: PantryDto = {
  pantryId: 1,
  ingredientName: '대파',
  expirationDate: '2026-09-10',
  dDay: 3,
  isImminent: false,
  isExpired: false,
  storageType: 'REFRIGERATED',
  registerType: 'MANUAL',
  imageUrl: null,
  createdAt: '2026-09-07T00:00:00Z',
};

describe('toPantryItem', () => {
  it('소비기한 임박 항목을 화면 모델로 변환한다', () => {
    const item = toPantryItem({ ...basePantryDto, dDay: 2, isImminent: true });

    expect(item).toMatchObject({
      id: '1',
      expirationStatus: 'IMMINENT',
      expirationLabel: '소비기한 2일 남음',
      imageUrl: undefined,
    });
  });

  it('경과 상태는 임박 여부와 관계없이 경과 상태를 우선한다', () => {
    const item = toPantryItem({ ...basePantryDto, isExpired: true, isImminent: true });

    expect(item).toMatchObject({
      expirationStatus: 'EXPIRED',
      expirationLabel: '소비기한 경과',
    });
  });

  it('소비기한 미등록 항목을 미등록 문구로 표시한다', () => {
    const item = toPantryItem({ ...basePantryDto, expirationDate: null, dDay: null });

    expect(item).toMatchObject({
      expirationStatus: 'UNREGISTERED',
      expirationLabel: '소비기한 미등록',
    });
  });
});
