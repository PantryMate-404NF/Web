export type PantryAvailability = 'AVAILABLE' | 'UNAVAILABLE';

export type ExpirationStatus = 'NORMAL' | 'IMMINENT' | 'EXPIRED' | 'UNREGISTERED';

export type PantryCardVariant = 'icon' | 'image';
export type PantryStorageType = 'REFRIGERATED' | 'FROZEN' | 'ROOMTEMP';
export type PantryRegistrationSource = 'PURCHASED' | 'MANUAL' | 'OCR';
export type PantrySortOption = 'RECENT' | 'IMMINENT' | 'OLDEST';

export function getPantryCardVariant(view?: string): PantryCardVariant {
  return view === 'image' ? 'image' : 'icon';
}

export interface PantryItem {
  id: string;
  name: string;
  /** 소비기한까지 남은 일수. 소비기한을 등록하지 않은 경우 null입니다. */
  daysUntilExpiration: number | null;
  expirationLabel: string;
  expirationStatus: ExpirationStatus;
  expirationDate?: string;
  consumptionDate?: string;
  availability: PantryAvailability;
  imageAlt: string;
  imageUrl?: string;
  storageType?: PantryStorageType;
  registrationSource?: PantryRegistrationSource;
  createdAt?: string;
}
