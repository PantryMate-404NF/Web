import type { ExpirationStatus } from './types';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const IMMINENT_DAY_LIMIT = 3;

function toUtcDay(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function parsePantryDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getPantryExpirationPresentation(
  consumptionDate: string,
  today = new Date(),
): {
  daysUntilExpiration: number | null;
  expirationLabel: string;
  expirationStatus: ExpirationStatus;
} {
  if (!consumptionDate) {
    return {
      daysUntilExpiration: null,
      expirationLabel: '소비기한 미등록',
      expirationStatus: 'UNREGISTERED',
    };
  }

  const remainingDays = Math.round(
    (parsePantryDate(consumptionDate) - toUtcDay(today)) / DAY_IN_MILLISECONDS,
  );

  if (remainingDays < 0) {
    return {
      daysUntilExpiration: remainingDays,
      expirationLabel: '소비기한 경과',
      expirationStatus: 'EXPIRED',
    };
  }

  if (remainingDays === 0) {
    return {
      daysUntilExpiration: 0,
      expirationLabel: '소비기한 오늘까지',
      expirationStatus: 'IMMINENT',
    };
  }

  return {
    daysUntilExpiration: remainingDays,
    expirationLabel: `소비기한 ${remainingDays}일 남음`,
    expirationStatus: remainingDays <= IMMINENT_DAY_LIMIT ? 'IMMINENT' : 'NORMAL',
  };
}
