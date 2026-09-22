import type { Food } from '@/domain/nutrition/model';
// Illustrative catalog only: never seeded as consumed meals.
export const demoCatalog: readonly Food[] = [
  {
    id: 'oatmeal',
    name: 'Oatmeal with berries',
    serving: '1 bowl (280 g)',
    nutrition: { calories: 380, protein: 14, carbs: 52, fat: 13 },
    illustration: 'oatmeal',
  },
  {
    id: 'salad',
    name: 'Grilled chicken salad',
    serving: '1 serving',
    nutrition: { calories: 450, protein: 48, carbs: 39, fat: 11 },
    illustration: 'salad',
  },
  {
    id: 'oats',
    name: 'Rolled oats',
    serving: '40 g',
    nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3 },
    illustration: 'oatmeal',
  },
];
