import { fireEvent, render } from '@testing-library/react-native';
import { CatalogScreen } from './CatalogScreen';
jest.mock('@/bootstrap/AppProvider', () => ({
  useDiary: () => ({
    catalog: [
      {
        id: 'oats',
        name: 'Rolled oats',
        serving: '40 g',
        nutrition: { calories: 150 },
        illustration: 'oatmeal',
      },
    ],
  }),
}));
jest.mock('@/design-system/icons/AppIcon', () => ({ AppIcon: () => null }));
test('filters local foods and shows a real empty search result', () => {
  const onSelect = jest.fn();
  const screen = render(<CatalogScreen onSelect={onSelect} />);
  fireEvent.press(screen.getByText('Rolled oats'));
  expect(onSelect).toHaveBeenCalledWith('oats');
  fireEvent.changeText(
    screen.getByLabelText('Search foods or meals'),
    'banana',
  );
  expect(screen.queryByText('Rolled oats')).toBeNull();
  expect(screen.getByText('No foods found. Try another name.')).toBeTruthy();
});
