import { completedAverage, movePeriod, periodDays } from './history';
test('uses Monday weeks and actual month length across year boundaries', () => {
  expect(periodDays('2026-01-01', 'Week')[0]).toBe('2025-12-29');
  expect(periodDays('2024-02-10', 'Month')).toHaveLength(29);
  expect(movePeriod('2026-01-31', 'Month', 1)).toBe('2026-02-01');
});
test('excludes missing days, today and future; includes explicitly logged zero', () => {
  expect(
    completedAverage(
      [
        { date: '2026-09-19', count: 0, calories: 0 },
        { date: '2026-09-20', count: 1, calories: 0 },
        { date: '2026-09-21', count: 1, calories: 100 },
        { date: '2026-09-22', count: 1, calories: 1000 },
        { date: '2026-09-23', count: 1, calories: 1000 },
      ],
      '2026-09-22',
    ),
  ).toEqual({ value: 50, count: 2 });
  expect(completedAverage([], '2026-09-22')).toEqual({ value: null, count: 0 });
});
