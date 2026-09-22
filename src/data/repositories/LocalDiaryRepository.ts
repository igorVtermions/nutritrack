import {
  defaultTargets,
  isNutrition,
  isFood,
  mealTypes,
  type MealEntry,
} from '@/domain/nutrition/model';
import type {
  DiaryRepository,
  DiaryState,
} from '@/features/diary/model/DiaryRepository';
import { isLocalDate } from '@/shared/date/localDate';
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}
const key = 'nutritrack:diary:v1';
function isEntry(value: unknown): value is MealEntry {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    'foodId' in value &&
    typeof value.foodId === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'serving' in value &&
    typeof value.serving === 'string' &&
    'quantity' in value &&
    typeof value.quantity === 'number' &&
    Number.isFinite(value.quantity) &&
    value.quantity > 0 &&
    value.quantity <= 1000 &&
    'meal' in value &&
    mealTypes.some((meal) => meal === value.meal) &&
    'date' in value &&
    isLocalDate(value.date) &&
    'createdAt' in value &&
    typeof value.createdAt === 'string' &&
    Number.isFinite(Date.parse(value.createdAt)) &&
    'nutrition' in value &&
    isNutrition(value.nutrition) &&
    'illustration' in value &&
    (value.illustration === 'oatmeal' ||
      value.illustration === 'salad' ||
      value.illustration === 'food')
  );
}
type LegacyState = Omit<
  DiaryState,
  'version' | 'customFoods' | 'favoriteIds' | 'deletedEntry'
> & { version: 1 | 2 };
function isLegacyState(value: unknown): value is LegacyState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    (value.version === 1 || value.version === 2) &&
    'onboarded' in value &&
    typeof value.onboarded === 'boolean' &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.length <= 80 &&
    'targets' in value &&
    isNutrition(value.targets) &&
    'entries' in value &&
    Array.isArray(value.entries) &&
    value.entries.every(isEntry) &&
    new Set(value.entries.map((entry) => entry.id)).size ===
      value.entries.length
  );
}
function isState(value: unknown): value is DiaryState {
  return (
    isLegacyState(value) &&
    value.version === 2 &&
    'customFoods' in value &&
    Array.isArray(value.customFoods) &&
    value.customFoods.every(isFood) &&
    new Set(value.customFoods.map((food) => food.id)).size ===
      value.customFoods.length &&
    'favoriteIds' in value &&
    Array.isArray(value.favoriteIds) &&
    value.favoriteIds.every((id) => typeof id === 'string') &&
    new Set(value.favoriteIds).size === value.favoriteIds.length &&
    'deletedEntry' in value &&
    (value.deletedEntry === null || isEntry(value.deletedEntry))
  );
}
export class LocalDiaryRepository implements DiaryRepository {
  private queue: Promise<void> = Promise.resolve();
  constructor(private readonly storage: KeyValueStorage) {}
  async load(): Promise<DiaryState> {
    const raw = await this.storage.getItem(key);
    if (raw === null)
      return {
        version: 2,
        onboarded: false,
        name: '',
        targets: { ...defaultTargets },
        entries: [],
        customFoods: [],
        favoriteIds: [],
        deletedEntry: null,
      };
    const parsed: unknown = JSON.parse(raw);
    // Keep the original storage key so existing installations retain their diary.
    // Migration is persisted with the next successful mutation, never during a read.
    if (isLegacyState(parsed) && parsed.version === 1)
      return {
        ...parsed,
        version: 2,
        customFoods: [],
        favoriteIds: [],
        deletedEntry: null,
      };
    if (!isState(parsed))
      throw new Error(
        'Saved data could not be read. Your data has not been changed.',
      );
    return parsed;
  }
  update(change: (state: DiaryState) => DiaryState): Promise<DiaryState> {
    const operation = this.queue.then(async () => {
      const next = change(await this.load());
      if (!isState(next)) throw new Error('These changes could not be saved.');
      await this.storage.setItem(key, JSON.stringify(next));
      return next;
    });
    this.queue = operation.then(
      () => undefined,
      () => undefined,
    ); // A failed write must not block subsequent retries.
    return operation;
  }
}
