import { progress, scaleNutrition, sumNutrition } from './model';
const oats = { calories: 380, protein: 14, carbs: 52, fat: 13 };
test('scales a known serving without rounding intermediate values', () => {
  expect(scaleNutrition(oats, 0.25)).toEqual({
    calories: 95,
    protein: 3.5,
    carbs: 13,
    fat: 3.25,
  });
  expect(
    sumNutrition([
      { nutrition: scaleNutrition(oats, 0.25) },
      { nutrition: scaleNutrition(oats, 0.75) },
    ]),
  ).toEqual(oats);
});
test.each([0, -1, NaN, Infinity, 1001])(
  'rejects invalid quantity %s',
  (quantity) => {
    expect(() => scaleNutrition(oats, quantity)).toThrow();
  },
);
test('handles zero targets and clamps only visual progress', () => {
  expect(progress(830, 0)).toBe(0);
  expect(progress(2500, 2000)).toBe(1);
  expect(
    2000 - sumNutrition([{ nutrition: { ...oats, calories: 2500 } }]).calories,
  ).toBe(-500);
});
