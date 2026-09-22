import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useDiary } from './AppProvider';
import { FoodDetailsScreen } from '@/features/food-catalog/FoodDetailsScreen';
import { AppText } from '@/design-system/components';
import { sumNutrition } from '@/domain/nutrition/model';

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
