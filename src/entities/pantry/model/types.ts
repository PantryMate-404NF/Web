export type PantryAvailability = 'AVAILABLE' | 'UNAVAILABLE';

export type ExpirationStatus = 'NORMAL' | 'IMMINENT' | 'EXPIRED' | 'UNREGISTERED';

export type PantryCardVariant = 'icon' | 'image';

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
}
