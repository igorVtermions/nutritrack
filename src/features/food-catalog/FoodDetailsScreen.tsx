import { useState } from 'react';
import { View } from 'react-native';
import { randomUUID } from 'expo-crypto';
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
import { AppIcon } from '@/design-system/icons/AppIcon';
import { colors, space } from '@/design-system/tokens';
import {
  mealTypes,
  scaleNutrition,
  type MealType,
} from '@/domain/nutrition/model';
import { useSubmission } from '@/shared/hooks/useSubmission';
export function FoodDetailsScreen({
  foodId,
  date,
  onBack,
  onDone,
}: {
  foodId: string;
  date: string;
  onBack: () => void;
  onDone: () => void;
}) {
  const { catalog, update } = useDiary();
  const food = catalog.find((item) => item.id === foodId);
  const [quantity, setQuantity] = useState('1');
  const [meal, setMeal] = useState<MealType>('Dinner');
  const [saved, setSaved] = useState(false);
  const { submit, pending, error } = useSubmission();
  const number = Number(quantity.replace(',', '.'));
  const valid =
    quantity.trim() !== '' &&
    Number.isFinite(number) &&
    number > 0 &&
    number <= 1000;
  if (!food)
    return (
      <Screen>
        <Header title="Food unavailable" onBack={onBack} />
        <AppText>This food could not be found.</AppText>
      </Screen>
    );
  if (saved)
    return (
      <Screen>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: space.xl,
          }}
        >
          <AppIcon name="check" size={64} />
          <AppText variant="title">Meal added</AppText>
          <AppText>
            {food.name} was saved to {date}.
          </AppText>
        </View>
        <Button label="Back to your day" onPress={onDone} />
      </Screen>
    );
  return (
    <Screen>
      <Header title="Food details" onBack={onBack} />
      <View
        style={[
          styles.card,
          { alignItems: 'center', backgroundColor: colors.soft },
        ]}
      >
        <AppIcon name={food.illustration} size={136} />
      </View>
      <AppText variant="section">{food.name}</AppText>
      <View style={styles.hero}>
        <AppText variant="section" style={{ color: colors.white }}>
          {valid ? Math.round(food.nutrition.calories * number) : '—'} kcal
        </AppText>
        <AppText style={{ color: colors.inverseMuted }}>
          Per serving: {food.nutrition.protein} g protein ·{' '}
          {food.nutrition.carbs} g carbs · {food.nutrition.fat} g fat
        </AppText>
      </View>
      <AppText muted>Serving size: {food.serving}</AppText>
      <Field
        label="Number of servings"
        keyboardType="decimal-pad"
        value={quantity}
        onChangeText={setQuantity}
      />
      {!valid && (
        <AppText accessibilityRole="alert">
          Enter a quantity greater than 0 and no more than 1,000.
        </AppText>
      )}
      <AppText variant="label">Meal · {date}</AppText>
      <View style={{ gap: space.sm }}>
        {mealTypes.map((value) => (
          <Button
            key={value}
            label={`${meal === value ? 'Selected: ' : ''}${value}`}
            secondary={meal !== value}
            onPress={() => setMeal(value)}
          />
        ))}
      </View>
      <AppText variant="caption" muted>
        Example food values for this prototype.
      </AppText>
      <ErrorMessage message={error} />
      <Button
        label={`Add to ${meal.toLowerCase()}`}
        loading={pending}
        disabled={!valid}
        onPress={() =>
          void submit(async () => {
            const entry = {
              id: randomUUID(),
              foodId: food.id,
              name: food.name,
              serving: food.serving,
              quantity: number,
              meal,
              date,
              createdAt: new Date().toISOString(),
              nutrition: scaleNutrition(food.nutrition, number),
              illustration: food.illustration,
            };
            await update((state) => ({
              ...state,
              entries: [...state.entries, entry],
            }));
            setSaved(true);
          })
        }
      />
    </Screen>
  );
}
