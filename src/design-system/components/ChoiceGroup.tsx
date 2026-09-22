import { Pressable, View, StyleSheet } from 'react-native';
import { AppText } from './index';
import { colors, radii, space } from '../tokens';
export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="label">{label}</AppText>
      <View style={styles.row}>
        {options.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityLabel={option}
            accessibilityState={{ checked: value === option, disabled }}
            disabled={disabled}
            onPress={() => onChange(option)}
            style={[
              styles.option,
              { backgroundColor: value === option ? colors.ink : colors.soft },
            ]}
          >
            <AppText
              variant="label"
              style={{ color: value === option ? colors.white : colors.ink }}
            >
              {option}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  option: {
    minHeight: 48,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radii.control,
    justifyContent: 'center',
  },
});
