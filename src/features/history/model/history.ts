import type { MealEntry } from '@/domain/nutrition/model';
import { localDate, shiftDate } from '@/shared/date/localDate';
export type Period = 'Week' | 'Month';
export type DaySummary = { date: string; count: number; calories: number };
export function periodDays(anchor: string, period: Period): string[] {
  const date = new Date(`${anchor}T12:00:00`);
  if (period === 'Week') {
    const start = shiftDate(anchor, -((date.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => shiftDate(start, index));
  }
  const start = localDate(new Date(date.getFullYear(), date.getMonth(), 1, 12));
  const length = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length }, (_, index) => shiftDate(start, index));
}
export function movePeriod(
  anchor: string,
  period: Period,
  direction: number,
): string {
  if (period === 'Week') return shiftDate(anchor, direction * 7);
  const date = new Date(`${anchor}T12:00:00`);
  return localDate(
    new Date(date.getFullYear(), date.getMonth() + direction, 1, 12),
  );
}
export function summarizeDays(
  entries: readonly MealEntry[],
  dates: readonly string[],
): DaySummary[] {
  const totals = new Map<string, { count: number; calories: number }>();
  for (const entry of entries) {
    const previous = totals.get(entry.date) ?? { count: 0, calories: 0 };
    totals.set(entry.date, {
      count: previous.count + 1,
      calories: previous.calories + entry.nutrition.calories,
    });
  }
  return dates.map((date) => ({
    date,
    ...(totals.get(date) ?? { count: 0, calories: 0 }),
  }));
}
export function completedAverage(
  days: readonly DaySummary[],
  today: string,
): { value: number | null; count: number } {
  const completed = days.filter((day) => day.date < today && day.count > 0);
  return {
    value: completed.length
      ? completed.reduce((sum, day) => sum + day.calories, 0) / completed.length
      : null,
    count: completed.length,
  };
}
