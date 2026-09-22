import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { AppText, styles } from '@/design-system/components';
import { colors } from '@/design-system/tokens';
import type { DaySummary } from '../model/history';
export function EnergyChart({
  days,
  target,
  today,
}: {
  days: readonly DaySummary[];
  target: number;
  today: string;
}) {
  const ceiling = Math.max(target, ...days.map((day) => day.calories), 1);
  const width = 310;
  const height = 160;
  const step = width / days.length;
  const targetY = height - (target / ceiling) * height;
  return (
    <View style={styles.hero}>
      <AppText variant="label" style={{ color: colors.white }}>
        Daily energy
      </AppText>
      <AppText variant="caption" style={{ color: colors.inverseMuted }}>
        kcal · {target.toLocaleString('en-US')} goal
      </AppText>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="Daily energy chart. Exact dates and values are listed below."
      >
        <Svg
          width="100%"
          height={180}
          viewBox={`0 -10 ${width} ${height + 20}`}
        >
          <Line
            x1={0}
            x2={width}
            y1={targetY}
            y2={targetY}
            stroke={colors.inverseMuted}
            strokeDasharray="4 4"
          />
          {days.map((day, index) =>
            day.count > 0 ? (
              <Rect
                key={day.date}
                x={index * step + step * 0.2}
                y={height - Math.max(2, (day.calories / ceiling) * height)}
                width={step * 0.6}
                height={Math.max(2, (day.calories / ceiling) * height)}
                rx={Math.min(6, step * 0.15)}
                fill={day.date === today ? colors.lime : colors.soft}
              />
            ) : (
              <Line
                key={day.date}
                x1={index * step + step * 0.3}
                x2={index * step + step * 0.7}
                y1={height}
                y2={height}
                stroke={colors.inverseMuted}
              />
            ),
          )}
        </Svg>
      </View>
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        <AppText variant="caption" style={{ color: colors.inverseMuted }}>
          {days[0]?.date}
        </AppText>
        <AppText variant="caption" style={{ color: colors.inverseMuted }}>
          {days[days.length - 1]?.date}
        </AppText>
      </View>
      <AppText variant="caption" style={{ color: colors.inverseMuted }}>
        Dash: no entries · bar: recorded day
      </AppText>
    </View>
  );
}
