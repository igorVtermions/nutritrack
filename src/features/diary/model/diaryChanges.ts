import { resizeEntry, type MealType } from '@/domain/nutrition/model';
import type { DiaryState } from './DiaryRepository';
export function editMeal(
  state: DiaryState,
  id: string,
  quantity: number,
  meal: MealType,
): DiaryState {
  const entry = state.entries.find((item) => item.id === id);
  if (!entry) throw new Error('Entry no longer exists.');
  return {
    ...state,
    entries: state.entries.map((item) =>
      item.id === id ? resizeEntry(entry, quantity, meal) : item,
    ),
  };
}
export function deleteMeal(state: DiaryState, id: string): DiaryState {
  const entry = state.entries.find((item) => item.id === id);
  if (!entry) throw new Error('Entry no longer exists.');
  return {
    ...state,
    entries: state.entries.filter((item) => item.id !== id),
    deletedEntry: entry,
  };
}
export function undoDelete(state: DiaryState): DiaryState {
  if (!state.deletedEntry) return state;
  return {
    ...state,
    entries: state.entries.some((item) => item.id === state.deletedEntry?.id)
      ? state.entries
      : [...state.entries, state.deletedEntry],
    deletedEntry: null,
  };
}
