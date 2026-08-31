export function toggleSelectedIngredient(selectedIds: string[], ingredientId: string): string[] {
  return selectedIds.includes(ingredientId)
    ? selectedIds.filter((id) => id !== ingredientId)
    : [...selectedIds, ingredientId];
}

export function toggleAllIngredients(ingredientIds: string[], selectedIds: string[]): string[] {
  return ingredientIds.length > 0 && ingredientIds.every((id) => selectedIds.includes(id))
    ? []
    : ingredientIds;
}
