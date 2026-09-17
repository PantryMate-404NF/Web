/** 레시피 조리 완료·스크랩 mutation과 캐시 갱신을 관리함 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeCooking, scrapRecipe, unscrapRecipe } from './recipe-mutations';

export function useRecipeMutations() {
  const queryClient = useQueryClient();
  const invalidateScraps = () => queryClient.invalidateQueries({ queryKey: ['recipe', 'scraps'] });
  return {
    completeCooking: useMutation({ mutationFn: completeCooking }),
    scrap: useMutation({ mutationFn: scrapRecipe, onSuccess: invalidateScraps }),
    unscrap: useMutation({ mutationFn: unscrapRecipe, onSuccess: invalidateScraps }),
  };
}
