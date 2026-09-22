import type { Food, MealEntry, Nutrition } from '@/domain/nutrition/model';
export type DiaryState = {
  version: 2;
  onboarded: boolean;
  name: string;
  targets: Nutrition;
  entries: MealEntry[];
  customFoods: Food[];
  favoriteIds: string[];
  deletedEntry: MealEntry | null;
};
export interface DiaryRepository {
  load(): Promise<DiaryState>;
  update(change: (state: DiaryState) => DiaryState): Promise<DiaryState>;
}
