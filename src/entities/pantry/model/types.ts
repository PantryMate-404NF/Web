export type PantryAvailability = 'AVAILABLE' | 'UNAVAILABLE';

export type ExpirationStatus = 'NORMAL' | 'IMMINENT' | 'EXPIRED' | 'UNREGISTERED';

export interface PantryItem {
  id: string;
  name: string;
  expirationLabel: string;
  expirationStatus: ExpirationStatus;
  availability: PantryAvailability;
  imageAlt: string;
}
