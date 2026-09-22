import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Button,
  Header,
  Screen,
  styles,
} from '@/design-system/components';
import { ChoiceGroup } from '@/design-system/components/ChoiceGroup';
import { space } from '@/design-system/tokens';
import { localDate } from '@/shared/date/localDate';
import {
  completedAverage,
  movePeriod,
  periodDays,
  summarizeDays,
  type Period,
} from './model/history';
import { EnergyChart } from './components/EnergyChart';
export function HistoryScreen() {
  const { state } = useDiary();
  const today = localDate();
  const [period, setPeriod] = useState<Period>('Week');
  const [anchor, setAnchor] = useState(today);
  const days = summarizeDays(state.entries, periodDays(anchor, period));
  const average = completedAverage(days, today);
  return (
    <Screen bottomInset={false} scroll={false}>
      <FlatList
        data={days}
        keyExtractor={(day) => day.date}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: space.xl }}>
            <Header title="Your history" />
            <AppText muted>
              A little perspective on your {period.toLowerCase()}.
            </AppText>
            <ChoiceGroup
              label="Period"
              options={['Week', 'Month']}
              value={period}
              onChange={setPeriod}
            />
            <View style={[styles.row, { flexWrap: 'wrap' }]}>
              <Button
                label="Previous"
                secondary
                onPress={() => setAnchor(movePeriod(anchor, period, -1))}
              />
              <Button
                label="Current"
                secondary
                onPress={() => setAnchor(today)}
              />
              <Button
                label="Next"
                secondary
                onPress={() => setAnchor(movePeriod(anchor, period, 1))}
              />
            </View>
            <EnergyChart
              days={days}
              target={state.targets.calories}
              today={today}
            />
            <View style={[styles.row, { flexWrap: 'wrap' }]}>
              <View style={styles.card}>
                <AppText variant="caption" muted>
                  Daily average
                </AppText>
                <AppText variant="section">
                  {average.value === null
                    ? '—'
                    : Math.round(average.value).toLocaleString('en-US')}
                </AppText>
              </View>
              <View style={styles.card}>
                <AppText variant="caption" muted>
                  Days logged
                </AppText>
                <AppText variant="section">
                  {days.filter((day) => day.count > 0).length} of {days.length}
                </AppText>
              </View>
            </View>
            <AppText variant="caption" muted>
              Average includes {average.count} past days with entries. Today,
              future days and days without entries are excluded.
            </AppText>
          </View>
        }
        renderItem={({ item: day }) => (
          <View style={styles.card}>
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
        )}
      />
    </Screen>
  );
}
