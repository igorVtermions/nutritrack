import { useState } from 'react';
import { randomUUID } from 'expo-crypto';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Button,
  ErrorMessage,
  Field,
  Header,
  Screen,
} from '@/design-system/components';
import { isFood, type Food } from '@/domain/nutrition/model';
import { useSubmission } from '@/shared/hooks/useSubmission';
export function CreateFoodScreen({
  onBack,
  onCreated,
}: {
  onBack: () => void;
  onCreated: (id: string) => void;
}) {
  const { update } = useDiary();
  const [id] = useState(() => `custom:${randomUUID()}`);
  const [name, setName] = useState('');
  const [serving, setServing] = useState('');
  const [values, setValues] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const { submit, pending, error } = useSubmission();
  const food: Food = {
    id,
    name: name.trim(),
    serving: serving.trim(),
    illustration: 'food',
    nutrition: {
      calories: Number(values.calories),
      protein: Number(values.protein),
      carbs: Number(values.carbs),
      fat: Number(values.fat),
    },
  };
  const valid =
    isFood(food) && Object.values(values).every((value) => value.trim() !== '');
  return (
    <Screen>
      <Header title="Create a food" onBack={onBack} />
      <AppText muted>Save a go-to food for faster logging.</AppText>
      <Field
        label="Food name"
        value={name}
        onChangeText={setName}
        maxLength={120}
        editable={!pending}
      />
      <Field
        label="One serving (for example: 100 g or 1 cup)"
        value={serving}
        onChangeText={setServing}
        maxLength={80}
        editable={!pending}
      />
      <AppText variant="section">Nutrition per serving</AppText>
      <AppText muted>
        Enter the values for exactly the serving described above. Logging
        multiplies these values by the number of servings.
      </AppText>
      {(['calories', 'protein', 'carbs', 'fat'] as const).map((key) => (
        <Field
          key={key}
          label={key === 'calories' ? 'Energy (kcal)' : `${key} (g)`}
          value={values[key]}
          keyboardType="decimal-pad"
          onChangeText={(text) =>
            setValues((current) => ({
              ...current,
              [key]: text.replace(',', '.'),
            }))
          }
          editable={!pending}
        />
      ))}
      <AppText variant="caption" muted>
        All fields are required. Nutrients accept values from 0 to 100,000 per
        serving. These values are provided by you and are not verified.
      </AppText>
      <ErrorMessage message={error} />
      <Button
        label="Save food"
        disabled={!valid}
        loading={pending}
        onPress={() =>
          void submit(async () => {
            await update((state) => ({
              ...state,
              customFoods: state.customFoods.some((item) => item.id === id)
                ? state.customFoods
                : [...state.customFoods, food],
            }));
            onCreated(id);
          })
        }
      />
    </Screen>
  );
}
