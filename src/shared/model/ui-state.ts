export const dataViewStates = ['loading', 'content', 'empty', 'error', 'unauthorized'] as const;

export type DataViewState = (typeof dataViewStates)[number];

export const interactionStates = ['default', 'pressed', 'disabled', 'loading'] as const;

export type InteractionState = (typeof interactionStates)[number];

export function isDataViewState(value: string): value is DataViewState {
  return dataViewStates.some((state) => state === value);
}

export function isInteractionState(value: string): value is InteractionState {
  return interactionStates.some((state) => state === value);
}
