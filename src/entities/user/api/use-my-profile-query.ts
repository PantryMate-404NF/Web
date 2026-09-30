import { useQuery } from '@tanstack/react-query';

import { getMyProfile } from './get-my-profile';

export const MY_PROFILE_QUERY_KEY = ['user', 'me'] as const;

export function useMyProfileQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getMyProfile,
    queryKey: MY_PROFILE_QUERY_KEY,
  });
}
