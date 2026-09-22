import { View } from 'react-native';
import { useDiary } from '@/bootstrap/AppProvider';
import { AppText, Header, Screen, styles } from '@/design-system/components';
import { sumNutrition } from '@/domain/nutrition/model';
import { localDate, shiftDate } from '@/shared/date/localDate';
export function HistoryScreen() {
  const { state } = useDiary();
  const today = localDate();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(today, index - 6);
    const entries = state.entries.filter((entry) => entry.date === date);
    return {
      date,
      count: entries.length,
      calories: sumNutrition(entries).calories,
    };
  });
  const completed = days.filter((day) => day.date !== today && day.count > 0);
  return (
    <Screen bottomInset={false}>
      <Header title="Your history" />
      <AppText muted>A little perspective on your week.</AppText>
      <AppText variant="section">Last 7 days</AppText>
      {days.map((day) => (
        <View key={day.date} style={styles.card}>
          <AppText variant="label">
            {day.date}
            {day.date === today ? ' · Today (partial)' : ''}
          </AppText>
          <AppText>
            {day.count
              ? `${Math.round(day.calories)} kcal · ${day.count} logged`
              : 'No entries'}
          </AppText>
        </View>
      ))}
      <AppText variant="section">
        Daily average:{' '}
        {completed.length
          ? `${Math.round(completed.reduce((sum, day) => sum + day.calories, 0) / completed.length)} kcal`
          : '—'}
      </AppText>
      <AppText variant="caption" muted>
        Average includes {completed.length} past days with entries. Today and
        days without entries are excluded.
      </AppText>
    </Screen>
  );
}
