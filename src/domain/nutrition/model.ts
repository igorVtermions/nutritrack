export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
export const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
export type MealType = (typeof mealTypes)[number];
export type Food = {
  id: string;
  name: string;
  serving: string;
  nutrition: Nutrition;
  illustration: 'oatmeal' | 'salad' | 'food';
};
export type MealEntry = {
  id: string;
  foodId: string;
  name: string;
  serving: string;
  quantity: number;
  meal: MealType;
  date: string;
  createdAt: string;
  nutrition: Nutrition;
  illustration: Food['illustration'];
};
export const defaultTargets: Nutrition = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fat: 70,
};
export const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};
export function isNutrition(value: unknown): value is Nutrition {
  if (typeof value !== 'object' || value === null) return false;
  return ['calories', 'protein', 'carbs', 'fat'].every(
    (key) =>
      key in value &&
      typeof Reflect.get(value, key) === 'number' &&
      Number.isFinite(Reflect.get(value, key)) &&
      Reflect.get(value, key) >= 0,
  );
}
export function scaleNutrition(
  nutrition: Nutrition,
  quantity: number,
): Nutrition {
  if (
    !isNutrition(nutrition) ||
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    quantity > 1000
  )
    throw new Error('Enter a quantity greater than 0 and no more than 1,000.');
  const result = {
    calories: nutrition.calories * quantity,
    protein: nutrition.protein * quantity,
    carbs: nutrition.carbs * quantity,
    fat: nutrition.fat * quantity,
  };
  if (!isNutrition(result)) throw new Error('Nutrition values are too large.');
  return result;
}
export function sumNutrition(
  entries: readonly { nutrition: Nutrition }[],
): Nutrition {
  return entries.reduce(
    (total, entry) => ({
      calories: total.calories + entry.nutrition.calories,
      protein: total.protein + entry.nutrition.protein,
      carbs: total.carbs + entry.nutrition.carbs,
      fat: total.fat + entry.nutrition.fat,
    }),
    { ...emptyNutrition },
  );
}
export function progress(consumed: number, target: number): number {
  return target > 0 ? Math.min(1, Math.max(0, consumed / target)) : 0;
}
export function isFood(value: unknown): value is Food {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.startsWith('custom:') &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    value.name.length <= 120 &&
    'serving' in value &&
    typeof value.serving === 'string' &&
    value.serving.trim().length > 0 &&
    value.serving.length <= 80 &&
    'nutrition' in value &&
    isNutrition(value.nutrition) &&
    Object.values(value.nutrition).every((n) => n <= 100000) &&
    'illustration' in value &&
    value.illustration === 'food'
  );
}
export function resizeEntry(
  entry: MealEntry,
  quantity: number,
  meal: MealType,
): MealEntry {
  const base = {
    calories: entry.nutrition.calories / entry.quantity,
    protein: entry.nutrition.protein / entry.quantity,
    carbs: entry.nutrition.carbs / entry.quantity,
    fat: entry.nutrition.fat / entry.quantity,
  };
  return {
    ...entry,
    quantity,
    meal,
    nutrition: scaleNutrition(base, quantity),
  };
}
