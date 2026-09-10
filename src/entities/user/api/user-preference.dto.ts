/** USER API가 저장·조회하는 온보딩 선호 설정 계약입니다. */

export type PreferredFoodType = 'KOREAN' | 'WESTERN' | 'JAPANESE' | 'CHINESE' | 'ETC';

export type TastePreferenceDto = {
  salty: number;
  sweet: number;
  spicy: number;
};

export type UserPreferenceUpdateRequest = {
  familyMemberCount: number;
  preferredFoodTypes: PreferredFoodType[];
  allergies: string[];
  favoriteFoods: string[];
  tastePreferences: TastePreferenceDto | null;
  onboardingCompleted: boolean;
  onboardingStep: number;
};

export type UserPreference = {
  preferenceId: string;
  userId: string;
  familyMemberCount: number;
  preferredFoodTypes: PreferredFoodType[] | null;
  allergies: string[] | null;
  favoriteFoods: string[] | null;
  tastePreferences: TastePreferenceDto | null;
  onboardingCompleted: boolean;
  onboardingStep: number;
  updatedAt: string;
};
