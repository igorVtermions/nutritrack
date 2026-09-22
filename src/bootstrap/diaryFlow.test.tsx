import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useDiary } from './AppProvider';
import { FoodDetailsScreen } from '@/features/food-catalog/FoodDetailsScreen';
import { AppText } from '@/design-system/components';
import { sumNutrition } from '@/domain/nutrition/model';
import { CreateFoodScreen } from '@/features/food-catalog/CreateFoodScreen';
import { CatalogScreen } from '@/features/food-catalog/CatalogScreen';
import { MealDetailsScreen } from '@/features/diary/MealDetailsScreen';
import { LocalDiaryRepository } from '@/data/repositories/LocalDiaryRepository';

jest.mock('@react-native-async-storage/async-storage', () => {
  const values = new Map<string, string>();
  return {
    getItem: jest.fn(async (key: string) => values.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      values.set(key, value);
    }),
    clear: jest.fn(async () => {
      values.clear();
    }),
  };
});
jest.mock('expo-crypto', () => ({ randomUUID: () => 'entry-test-id' }));
jest.mock('@/design-system/icons/AppIcon', () => ({ AppIcon: () => null }));

function Total() {
  const { state } = useDiary();
  return (
    <AppText testID="total">{sumNutrition(state.entries).calories}</AppText>
  );
}

beforeEach(async () => {
  await AsyncStorage.clear();
});
test('creates a food with explicit serving, persists it and adds it to favorites', async () => {
  const onCreated = jest.fn();
  const creation = render(
    <AppProvider>
      <CreateFoodScreen onBack={jest.fn()} onCreated={onCreated} />
    </AppProvider>,
  );
  await waitFor(() =>
    expect(creation.getByLabelText('Food name')).toBeTruthy(),
  );
  expect(creation.getByRole('button', { name: 'Save food' })).toBeDisabled();
  fireEvent.changeText(creation.getByLabelText('Food name'), 'Rice');
  fireEvent.changeText(
    creation.getByLabelText('One serving (for example: 100 g or 1 cup)'),
    '100 g',
  );
  for (const [label, value] of [
    ['Energy (kcal)', '130'],
    ['protein (g)', '3'],
    ['carbs (g)', '28'],
    ['fat (g)', '0'],
  ]) {
    if (label && value)
      fireEvent.changeText(creation.getByLabelText(label), value);
  }
  fireEvent.press(creation.getByText('Save food'));
  await waitFor(() =>
    expect(onCreated).toHaveBeenCalledWith('custom:entry-test-id'),
  );
  creation.unmount();
  const details = render(
    <AppProvider>
      <FoodDetailsScreen
        foodId="custom:entry-test-id"
        date="2026-09-22"
        onBack={jest.fn()}
        onDone={jest.fn()}
      />
    </AppProvider>,
  );
  await waitFor(() => expect(details.getByText('Rice')).toBeTruthy());
  fireEvent.press(details.getByText('Save to favorites'));
  await waitFor(() =>
    expect(details.getByText('Remove from favorites')).toBeTruthy(),
  );
  details.unmount();
  const library = render(
    <AppProvider>
      <CatalogScreen onSelect={jest.fn()} onCreate={jest.fn()} />
    </AppProvider>,
  );
  await waitFor(() => expect(library.getByText('Rice')).toBeTruthy());
  expect(library.queryByText('Rolled oats')).toBeNull();
});
test('meal edit updates totals and survives reopening without changing the record id', async () => {
  const repo = new LocalDiaryRepository(AsyncStorage);
  await repo.update((state) => ({
    ...state,
    entries: [
      {
        id: 'edit-id',
        foodId: 'oatmeal',
        name: 'Oats',
        serving: '1 bowl',
        meal: 'Breakfast',
        quantity: 1,
        date: '2026-09-22',
        createdAt: '2026-09-22T12:00:00Z',
        nutrition: { calories: 380, protein: 14, carbs: 52, fat: 13 },
        illustration: 'oatmeal',
      },
    ],
  }));
  const screen = render(
    <AppProvider>
      <MealDetailsScreen entryId="edit-id" onBack={jest.fn()} />
      <Total />
    </AppProvider>,
  );
  await waitFor(() => expect(screen.getByText('Edit meal')).toBeTruthy());
  fireEvent.press(screen.getByText('Edit meal'));
  fireEvent.changeText(screen.getByLabelText('Number of servings'), '2');
  fireEvent.press(screen.getByRole('radio', { name: 'Lunch' }));
  fireEvent.press(screen.getByText('Save meal'));
  await waitFor(() => expect(screen.getByText('Your lunch')).toBeTruthy());
  expect(screen.getByTestId('total').props.children).toBe(760);
  expect(
    (await new LocalDiaryRepository(AsyncStorage).load()).entries[0],
  ).toMatchObject({ id: 'edit-id', quantity: 2, meal: 'Lunch' });
});

test('adding a portion persists the snapshot, updates totals and survives provider remount', async () => {
  const screen = render(
    <AppProvider>
      <FoodDetailsScreen
        foodId="oatmeal"
        date="2026-09-22"
        onBack={jest.fn()}
        onDone={jest.fn()}
      />
      <Total />
    </AppProvider>,
  );
  await waitFor(() =>
    expect(screen.getByLabelText('Number of servings')).toBeTruthy(),
  );
  fireEvent.changeText(screen.getByLabelText('Number of servings'), '2');
  fireEvent.press(screen.getByText('Add to dinner'));
  await waitFor(() => expect(screen.getByText('Meal added')).toBeTruthy());
  expect(screen.getByTestId('total').props.children).toBe(760);
  screen.unmount();
  const reopened = render(
    <AppProvider>
      <Total />
    </AppProvider>,
  );
  await waitFor(() =>
    expect(reopened.getByTestId('total').props.children).toBe(760),
  );
});

test('failed save retains the form and does not show success or change totals', async () => {
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('Disk full'));
  const screen = render(
    <AppProvider>
      <FoodDetailsScreen
        foodId="oatmeal"
        date="2026-09-22"
        onBack={jest.fn()}
        onDone={jest.fn()}
      />
      <Total />
    </AppProvider>,
  );
  await waitFor(() =>
    expect(screen.getByLabelText('Number of servings')).toBeTruthy(),
  );
  fireEvent.press(screen.getByText('Add to dinner'));
  await waitFor(() =>
    expect(screen.getByText(/Couldn’t save your changes/)).toBeTruthy(),
  );
  expect(screen.queryByText('Meal added')).toBeNull();
  expect(screen.getByTestId('total').props.children).toBe(0);
  fireEvent.press(screen.getByText('Add to dinner'));
  await waitFor(() => expect(screen.getByText('Meal added')).toBeTruthy());
});
