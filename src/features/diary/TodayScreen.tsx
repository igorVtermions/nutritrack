import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useDiary } from '@/bootstrap/AppProvider';
import { AppText, Button, ErrorMessage, Screen, styles } from '@/design-system/components';
import { AppIcon } from '@/design-system/icons/AppIcon';
import { colors, space } from '@/design-system/tokens';
import { progress, sumNutrition } from '@/domain/nutrition/model';
import { localDate, shiftDate } from '@/shared/date/localDate';
import { undoDelete } from './model/diaryChanges';
import { useSubmission } from '@/shared/hooks/useSubmission';
export function TodayScreen({
  onLog,
  onEntry,
}: {
  onLog: (date: string) => void;
  onEntry: (id: string) => void;
}) {
  const { state, update } = useDiary();
  const { submit, pending, error } = useSubmission();
  const [date, setDate] = useState(localDate);
  const entries = state.entries.filter((entry) => entry.date === date);
  const total = sumNutrition(entries);
  const remaining = state.targets.calories - total.calories;
  const ratio = progress(total.calories, state.targets.calories);
  return (
    <Screen bottomInset={false}>
      {state.deletedEntry && (
        <View style={styles.card}>
          <AppText accessibilityLiveRegion="polite">
            Deleted {state.deletedEntry.name} · {state.deletedEntry.date}
          </AppText>
          <ErrorMessage message={error} />
          <Button
            label="Undo delete"
            loading={pending}
            onPress={() =>
              void submit(async () => {
                await update(undoDelete);
              })
            }
          />
        </View>
      )}
      <View style={styles.row}>
        <AppIcon name="logo" />
        <AppText variant="section">NutriTrack</AppText>
      </View>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous day"
          style={styles.iconButton}
          onPress={() => setDate(shiftDate(date, -1))}
        >
          <AppIcon name="back" />
        </Pressable>
        <AppText variant="caption" style={{ flex: 1, textAlign: 'center' }}>
          {date}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next day"
          style={styles.iconButton}
          onPress={() => setDate(shiftDate(date, 1))}
        >
          <AppIcon name="chevron" />
        </Pressable>
      </View>
      <View>
        <AppText variant="display">Your day</AppText>
        <AppText muted>One meal at a time.</AppText>
      </View>
      <View style={styles.hero}>
        <AppText variant="section" style={{ color: colors.white }}>
          Daily intake
        </AppText>
        <View
          style={[
            styles.row,
            { flexWrap: 'wrap', justifyContent: 'space-between' },
          ]}
        >
          <View>
            <AppText variant="metric" style={{ color: colors.white }}>
              {Math.round(total.calories).toLocaleString('en-US')}
            </AppText>
            <AppText variant="label" style={{ color: colors.inverseMuted }}>
              of {state.targets.calories.toLocaleString('en-US')} kcal
            </AppText>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={104} height={104}>
              <Circle
                cx={52}
                cy={52}
                r={43}
                stroke={colors.inverseLine}
                strokeWidth={10}
                fill="none"
              />
              {ratio > 0 && (
                <Circle
                  cx={52}
                  cy={52}
                  r={43}
                  stroke={colors.lime}
                  strokeWidth={10}
                  fill="none"
                  strokeDasharray={`${ratio * 270.18} 270.18`}
                  strokeLinecap="round"
                  rotation={-90}
                  origin="52, 52"
                />
              )}
            </Svg>
            <AppText
              variant="label"
              style={{ position: 'absolute', color: colors.white }}
            >
              {Math.round(ratio * 100)}%
            </AppText>
          </View>
        </View>
        <AppText style={{ color: colors.lime }}>
          {Math.round(Math.abs(remaining)).toLocaleString('en-US')} kcal{' '}
          {remaining < 0 ? 'above target' : 'remaining'}
        </AppText>
        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          {(['protein', 'carbs', 'fat'] as const).map((key) => (
            <View key={key} style={{ flex: 1, minWidth: 80, gap: space.xs }}>
              <AppText
                variant="caption"
                style={{
                  color: colors.inverseMuted,
                  textTransform: 'capitalize',
                }}
              >
                {key}
              </AppText>
              <AppText variant="caption" style={{ color: colors.white }}>
                {Math.round(total[key])} / {state.targets[key]} g
              </AppText>
              <View
                style={{
                  height: 6,
                  backgroundColor: colors.inverseLine,
                  borderRadius: 3,
                }}
              >
                <View
                  style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.lime,
                    width: `${progress(total[key], state.targets[key]) * 100}%`,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
      {entries.length ? (
        <>
          <AppText variant="section">Your meals</AppText>
          {entries.map((entry) => (
            <Pressable
              key={entry.id}
              accessibilityRole="button"
              onPress={() => onEntry(entry.id)}
              style={[styles.card, styles.row]}
            >
              <AppIcon name={entry.illustration} size={54} />
              <View style={{ flex: 1 }}>
                <AppText variant="label">{entry.name}</AppText>
                <AppText variant="caption" muted>
                  {entry.meal} · {Math.round(entry.nutrition.calories)} kcal
                </AppText>
              </View>
              <AppIcon name="chevron" />
            </Pressable>
          ))}
        </>
      ) : (
        <View style={{ alignItems: 'center', gap: space.md }}>
          <AppIcon name="oatmeal" size={102} />
          <AppText variant="section">Your first meal awaits</AppText>
          <AppText muted style={{ textAlign: 'center' }}>
            Add something you ate to start your log.
          </AppText>
        </View>
      )}
      <Button
        label={entries.length ? 'Log food' : 'Log your first meal'}
        onPress={() => onLog(date)}
      />
    </Screen>
  );
}
