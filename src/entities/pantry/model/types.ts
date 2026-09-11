export type PantryAvailability = 'AVAILABLE' | 'UNAVAILABLE';

export type ExpirationStatus = 'NORMAL' | 'IMMINENT' | 'EXPIRED' | 'UNREGISTERED';

export type PantryCardVariant = 'icon' | 'image';
export type PantryStorageType = 'REFRIGERATED' | 'FROZEN' | 'ROOMTEMP';
export type PantryRegistrationSource = 'PURCHASED' | 'MANUAL';
export type PantrySortOption = 'RECENT' | 'IMMINENT' | 'OLDEST';

export function getPantryCardVariant(view?: string): PantryCardVariant {
  return view === 'image' ? 'image' : 'icon';
}

export interface PantryItem {
  id: string;
  name: string;
  expirationLabel: string;
  expirationStatus: ExpirationStatus;
  availability: PantryAvailability;
  imageAlt: string;
  imageUrl?: string;
  storageType?: PantryStorageType;
  registrationSource?: PantryRegistrationSource;
  createdAt?: string;
}
