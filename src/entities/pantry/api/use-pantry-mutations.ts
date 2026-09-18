/** 팬트리 변경 요청과 목록 캐시 갱신을 관리함 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPantryItem } from './create-pantry-item';
import { deletePantryItem } from './delete-pantry-item';
import { PANTRY_QUERY_KEY } from './use-pantries-query';
import { updatePantryItem } from './update-pantry-item';

export function usePantryMutations() {
  const queryClient = useQueryClient();
  const invalidatePantry = () => queryClient.invalidateQueries({ queryKey: PANTRY_QUERY_KEY });

  return {
    create: useMutation({ mutationFn: createPantryItem, onSuccess: invalidatePantry }),
    update: useMutation({
      mutationFn: ({
        pantryItemId,
        payload,
      }: Parameters<typeof updatePantryItem>[0] extends never
        ? never
        : { pantryItemId: string; payload: Parameters<typeof updatePantryItem>[1] }) =>
        updatePantryItem(pantryItemId, payload),
      onSuccess: invalidatePantry,
    }),
    remove: useMutation({ mutationFn: deletePantryItem, onSuccess: invalidatePantry }),
  };
}
