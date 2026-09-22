import {
  LocalDiaryRepository,
  type KeyValueStorage,
} from './LocalDiaryRepository';
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
