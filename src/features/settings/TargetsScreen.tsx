import { useState } from 'react';
import { View } from 'react-native';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Button,
  ErrorMessage,
  Field,
  Header,
  Screen,
  styles,
} from '@/design-system/components';
import { colors } from '@/design-system/tokens';
import { useSubmission } from '@/shared/hooks/useSubmission';
export function TargetsScreen({ onBack }: { onBack: () => void }) {
  const { state, update } = useDiary();
  const [values, setValues] = useState({
    calories: String(state.targets.calories),
    protein: String(state.targets.protein),
    carbs: String(state.targets.carbs),
    fat: String(state.targets.fat),
  });
  const { submit, pending, error } = useSubmission();
  const valid = Object.values(values).every(
    (value) =>
      value.trim() !== '' &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0 &&
      Number(value) <= 100000,
  );
  return (
    <Screen>
      <Header title="Daily targets" onBack={onBack} />
      <AppText muted>Choose the numbers that work for you.</AppText>
      <View style={[styles.card, { backgroundColor: colors.soft }]}>
        <AppText variant="section">A guide, not a grade.</AppText>
        <AppText>
          Your targets are personal and editable. These are example values.
        </AppText>
      </View>
      {(['calories', 'protein', 'carbs', 'fat'] as const).map((key) => (
        <Field
          key={key}
          label={key === 'calories' ? 'Daily energy (kcal)' : `${key} (g)`}
          value={values[key]}
          keyboardType="decimal-pad"
          onChangeText={(text) =>
            setValues({ ...values, [key]: text.replace(',', '.') })
          }
        />
      ))}
      {!valid && (
        <AppText accessibilityRole="alert">
          Use numbers from 0 to 100,000 in every field.
        </AppText>
      )}
      <AppText variant="caption" muted>
        Energy and macro targets are independent example values.
      </AppText>
      <ErrorMessage message={error} />
      <Button
        label="Save targets"
        disabled={!valid}
        loading={pending}
        onPress={() =>
          void submit(async () => {
            await update((current) => ({
              ...current,
              targets: {
                calories: Number(values.calories),
                protein: Number(values.protein),
                carbs: Number(values.carbs),
                fat: Number(values.fat),
              },
            }));
            onBack();
          })
        }
      />
    </Screen>
  );
}
