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
import { ChoiceGroup } from '@/design-system/components/ChoiceGroup';
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
  const { catalog, state, update } = useDiary();
  const favorite = state.favoriteIds.includes(foodId);
  const favoriteSubmission = useSubmission();
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
        <AppIcon
          name={food.illustration}
          size={food.illustration === 'food' ? 48 : 136}
        />
      </View>
      <AppText variant="section">{food.name}</AppText>
      <ErrorMessage message={favoriteSubmission.error} />
      <Button
        label={favorite ? 'Remove from favorites' : 'Save to favorites'}
        secondary
        loading={favoriteSubmission.pending}
        onPress={() =>
          void favoriteSubmission.submit(async () => {
            await update((current) => ({
              ...current,
              favoriteIds: current.favoriteIds.includes(foodId)
                ? current.favoriteIds.filter((id) => id !== foodId)
                : [...current.favoriteIds, foodId],
            }));
          })
        }
      />
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
        editable={!pending}
      />
      {!valid && (
        <AppText accessibilityRole="alert">
          Enter a quantity greater than 0 and no more than 1,000.
        </AppText>
      )}
      <AppText variant="label">Meal · {date}</AppText>
      <ChoiceGroup
        label="Meal"
        options={mealTypes}
        value={meal}
        onChange={setMeal}
        disabled={pending}
      />
      <AppText variant="caption" muted>
        {food.id.startsWith('custom:')
          ? 'Your food · nutrition values entered by you.'
          : 'Example food values for this prototype.'}
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
