import { isLocalDate, localDate, shiftDate } from './localDate';
test('uses local calendar fields at midnight', () => {
  expect(localDate(new Date(2026, 8, 22, 0, 1))).toBe('2026-09-22');
  expect(localDate(new Date(2026, 8, 22, 23, 59))).toBe('2026-09-22');
});
test('validates actual calendar dates', () => {
  expect(isLocalDate('2026-02-30')).toBe(false);
  expect(isLocalDate('2024-02-29')).toBe(true);
  expect(shiftDate('2026-01-01', -1)).toBe('2025-12-31');
});
