import type { MealEntry, Nutrition } from '@/domain/nutrition/model';
export type DiaryState = {
  version: 1;
  onboarded: boolean;
  name: string;
  targets: Nutrition;
  entries: MealEntry[];
};
export interface DiaryRepository {
  load(): Promise<DiaryState>;
  update(change: (state: DiaryState) => DiaryState): Promise<DiaryState>;
}
