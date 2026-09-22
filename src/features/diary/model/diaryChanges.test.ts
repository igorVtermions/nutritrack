import { deleteMeal, editMeal, undoDelete } from './diaryChanges';
import { defaultTargets, sumNutrition } from '@/domain/nutrition/model';
import type { DiaryState } from './DiaryRepository';
const initial: DiaryState = {
  version: 2,
  name: '',
  onboarded: true,
  targets: defaultTargets,
  customFoods: [],
  favoriteIds: [],
  deletedEntry: null,
  entries: [
    {
      id: 'meal',
      foodId: 'old-food',
      name: 'Saved food',
      serving: '1 bowl',
      meal: 'Breakfast',
      date: '2026-09-22',
      createdAt: '2026-09-22T12:00:00Z',
      quantity: 2,
      nutrition: { calories: 760, protein: 28, carbs: 104, fat: 26 },
      illustration: 'oatmeal',
    },
  ],
};
test('edits from the saved snapshot without changing identity or date', () => {
  const result = editMeal(initial, 'meal', 0.5, 'Lunch');
  expect(result.entries[0]).toMatchObject({
    id: 'meal',
    date: '2026-09-22',
    createdAt: '2026-09-22T12:00:00Z',
    quantity: 0.5,
    meal: 'Lunch',
    nutrition: { calories: 190, protein: 7, carbs: 26, fat: 6.5 },
  });
  expect(initial.entries[0]?.quantity).toBe(2);
});
test('delete and undo restore the exact snapshot once', () => {
  const deleted = deleteMeal(initial, 'meal');
  expect(sumNutrition(deleted.entries).calories).toBe(0);
  const restored = undoDelete(deleted);
  expect(restored.entries).toEqual(initial.entries);
  expect(undoDelete(restored)).toEqual(restored);
});
test('rejects invalid edits and stale entries', () => {
  expect(() => editMeal(initial, 'meal', 0, 'Lunch')).toThrow();
  expect(() => editMeal(initial, 'missing', 1, 'Lunch')).toThrow();
});
