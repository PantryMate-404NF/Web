/**
 * Pantry API DTO가 화면 모델로 변환될 때 소비기한 상태와 표시 문구를 검증합니다.
 */
import { describe, expect, it } from 'vitest';

import type { PantryItemDto } from './pantry.dto';
import { toPantryItem } from './pantry.mapper';

const basePantryDto: PantryItemDto = {
  pantryItemId: 1,
  ingredientName: '대파',
  sellByDate: '2026-09-07',
  expiryDate: '2026-09-10',
  dDay: 3,
  expiryStatus: 'NORMAL',
  storageType: 'REFRIGERATED',
  isExpiryAutoCalculated: false,
  isCookable: true,
  registerType: 'MANUAL',
  imageUrl: null,
};

describe('toPantryItem', () => {
  it('소비기한 임박 항목을 화면 모델로 변환한다', () => {
    const item = toPantryItem({ ...basePantryDto, dDay: 2, expiryStatus: 'IMMINENT' });

    expect(item).toMatchObject({
      id: '1',
      expirationDate: '2026-09-07',
      consumptionDate: '2026-09-10',
      expirationStatus: 'IMMINENT',
      expirationLabel: '소비기한 2일 남음',
      imageUrl: undefined,
      registrationSource: 'MANUAL',
    });
  });

  it('Swagger의 경과 상태를 경과 문구로 변환한다', () => {
    const item = toPantryItem({ ...basePantryDto, expiryStatus: 'EXPIRED' });

    expect(item).toMatchObject({
      expirationStatus: 'EXPIRED',
      expirationLabel: '소비기한 경과',
    });
  });

  it('소비기한이 없는 항목을 미등록 문구로 표시한다', () => {
    const item = toPantryItem({ ...basePantryDto, expiryDate: null, dDay: null });

    expect(item).toMatchObject({
      expirationStatus: 'UNREGISTERED',
      expirationLabel: '소비기한 미등록',
    });
  });

  it('실온 보관 Swagger 값을 화면 모델에 보존한다', () => {
    const item = toPantryItem({ ...basePantryDto, storageType: 'ROOM_TEMP' });

    expect(item.storageType).toBe('ROOM_TEMP');
  });
});
