import {
  LocalDiaryRepository,
  type KeyValueStorage,
} from './LocalDiaryRepository';
import { defaultTargets, type Food } from '@/domain/nutrition/model';
import {
  deleteMeal,
  editMeal,
  undoDelete,
} from '@/features/diary/model/diaryChanges';
function memory() {
  const values = new Map<string, string>();
  const storage: KeyValueStorage = {
    getItem: jest.fn(async (key) => values.get(key) ?? null),
    setItem: jest.fn(async (key, value) => {
      values.set(key, value);
    }),
  };
  return storage;
}
test('migrates v1 without overwriting on read, then persists v2 on mutation', async () => {
  const storage = memory();
  const entry = {
    id: 'saved',
    foodId: 'oatmeal',
    name: 'Oats',
    serving: '1 bowl',
    quantity: 1,
    meal: 'Breakfast',
    date: '2026-09-22',
    createdAt: '2026-09-22T12:00:00Z',
    nutrition: { calories: 380, protein: 14, carbs: 52, fat: 13 },
    illustration: 'oatmeal',
  };
  await storage.setItem(
    'nutritrack:diary:v1',
    JSON.stringify({
      version: 1,
      name: 'Alex',
      onboarded: true,
      targets: defaultTargets,
      entries: [entry],
    }),
  );
  jest.mocked(storage.setItem).mockClear();
  const repo = new LocalDiaryRepository(storage);
  expect(await repo.load()).toMatchObject({
    version: 2,
    name: 'Alex',
    entries: [entry],
    customFoods: [],
    favoriteIds: [],
    deletedEntry: null,
  });
  expect(storage.setItem).not.toHaveBeenCalled();
  await repo.update((state) => editMeal(state, 'saved', 2, 'Lunch'));
  const reopened = new LocalDiaryRepository(storage);
  expect((await reopened.load()).entries[0]?.nutrition.calories).toBe(760);
  await reopened.update((state) => deleteMeal(state, 'saved'));
  const deleted = await new LocalDiaryRepository(storage).load();
  expect(deleted.entries).toEqual([]);
  expect(deleted.deletedEntry?.id).toBe('saved');
  await reopened.update(undoDelete);
  expect((await reopened.load()).entries[0]).toMatchObject({
    id: 'saved',
    quantity: 2,
    meal: 'Lunch',
  });
});
test('persists custom foods and favorites, rejects malformed custom food', async () => {
  const storage = memory();
  const repo = new LocalDiaryRepository(storage);
  const food: Food = {
    id: 'custom:test',
    name: 'Rice',
    serving: '100 g',
    nutrition: { calories: 130, protein: 3, carbs: 28, fat: 0 },
    illustration: 'food',
  };
  await repo.update((state) => ({
    ...state,
    customFoods: [food],
    favoriteIds: [food.id],
  }));
  expect(await new LocalDiaryRepository(storage).load()).toMatchObject({
    customFoods: [food],
    favoriteIds: [food.id],
  });
  await expect(
    repo.update((state) => ({
      ...state,
      customFoods: [{ ...food, name: '' }],
    })),
  ).rejects.toThrow();
  expect((await repo.load()).customFoods).toEqual([food]);
});
test('reopens saved data with a new repository instance', async () => {
  const storage = memory();
  const first = new LocalDiaryRepository(storage);
  await first.update((state) => ({ ...state, name: 'Alex', onboarded: true }));
  expect(await new LocalDiaryRepository(storage).load()).toMatchObject({
    name: 'Alex',
    onboarded: true,
    entries: [],
  });
});
test('serializes concurrent writes without losing changes', async () => {
  const repo = new LocalDiaryRepository(memory());
  await Promise.all([
    repo.update((state) => ({ ...state, name: 'Alex' })),
    repo.update((state) => ({ ...state, onboarded: true })),
  ]);
  expect(await repo.load()).toMatchObject({ name: 'Alex', onboarded: true });
});
test('failed writes preserve confirmed state and allow retry', async () => {
  const storage = memory();
  const repo = new LocalDiaryRepository(storage);
  await repo.update((state) => ({ ...state, name: 'Before' }));
  jest.mocked(storage.setItem).mockRejectedValueOnce(new Error('Disk full'));
  await expect(
    repo.update((state) => ({ ...state, name: 'After' })),
  ).rejects.toThrow();
  expect((await repo.load()).name).toBe('Before');
  await repo.update((state) => ({ ...state, name: 'Retry' }));
  expect((await repo.load()).name).toBe('Retry');
});
test.each(['not json', '{"version":2}', '{"version":1,"entries":[]}'])(
  'does not overwrite invalid saved data: %s',
  async (raw) => {
    const storage = memory();
    jest.mocked(storage.getItem).mockResolvedValue(raw);
    const repo = new LocalDiaryRepository(storage);
    await expect(repo.load()).rejects.toThrow();
    await expect(
      repo.update((state) => ({ ...state, name: 'Test' })),
    ).rejects.toThrow();
    expect(storage.setItem).not.toHaveBeenCalled();
  },
);
