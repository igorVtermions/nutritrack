import { useState } from 'react';
import { Alert, View } from 'react-native';
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
import { ChoiceGroup } from '@/design-system/components/ChoiceGroup';
import { AppIcon } from '@/design-system/icons/AppIcon';
import { useSubmission } from '@/shared/hooks/useSubmission';
import {
  mealTypes,
  type MealEntry,
  type MealType,
} from '@/domain/nutrition/model';
import { deleteMeal, editMeal, undoDelete } from './model/diaryChanges';

export function MealDetailsScreen({
  entryId,
  onBack,
}: {
  entryId: string;
  onBack: () => void;
}) {
  const { state, update } = useDiary();
  const entry = state.entries.find((item) => item.id === entryId);
  const { submit, pending, error } = useSubmission();
  const [editing, setEditing] = useState(false);
  if (!entry)
    return (
      <Screen>
        <Header title="Meal details" onBack={onBack} />
        <AppText>This entry is no longer in your diary.</AppText>
        <ErrorMessage message={error} />
        {state.deletedEntry?.id === entryId && (
          <Button
            label="Undo delete"
            loading={pending}
            onPress={() =>
              void submit(async () => {
                await update(undoDelete);
              })
            }
          />
        )}
        <Button label="Back to your day" secondary onPress={onBack} />
      </Screen>
    );
  if (editing)
    return <MealEditor entry={entry} onClose={() => setEditing(false)} />;
  return (
    <Screen>
      <Header title={`Your ${entry.meal.toLowerCase()}`} onBack={onBack} />
      <AppText muted>{entry.date}</AppText>
      <View style={{ alignItems: 'center' }}>
        <AppIcon name={entry.illustration} size={116} />
        <AppText variant="section">{entry.name}</AppText>
        <AppText variant="section">
          {Math.round(entry.nutrition.calories)} kcal
        </AppText>
      </View>
      <AppText variant="section">What’s inside</AppText>
      <View style={styles.card}>
        <AppText>
          {entry.quantity} × {entry.serving}
        </AppText>
        <AppText>Protein: {Math.round(entry.nutrition.protein)} g</AppText>
        <AppText>Carbs: {Math.round(entry.nutrition.carbs)} g</AppText>
        <AppText>Fat: {Math.round(entry.nutrition.fat)} g</AppText>
      </View>
      <ErrorMessage message={error} />
      <Button
        label="Edit meal"
        disabled={pending}
        onPress={() => setEditing(true)}
      />
      <Button
        label="Delete meal"
        secondary
        loading={pending}
        onPress={() =>
          Alert.alert(
            'Delete this meal?',
            'You can undo the most recent deletion.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () =>
                  void submit(async () => {
                    await update((current) => deleteMeal(current, entryId));
                  }),
              },
            ],
          )
        }
      />
    </Screen>
  );
}
function MealEditor({
  entry,
  onClose,
}: {
  entry: MealEntry;
  onClose: () => void;
}) {
  const { update } = useDiary();
  const [quantity, setQuantity] = useState(String(entry.quantity));
  const [meal, setMeal] = useState<MealType>(entry.meal);
  const { submit, pending, error } = useSubmission();
  const number = Number(quantity.replace(',', '.'));
  const valid =
    quantity.trim() !== '' &&
    Number.isFinite(number) &&
    number > 0 &&
    number <= 1000;
  return (
    <Screen>
      <Header title="Edit meal" onBack={onClose} />
      <AppText variant="section">{entry.name}</AppText>
      <AppText muted>
        {entry.serving} · {entry.date}
      </AppText>
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
      <ChoiceGroup
        label="Meal"
        options={mealTypes}
        value={meal}
        onChange={setMeal}
        disabled={pending}
      />
      <ErrorMessage message={error} />
      <Button
        label="Save meal"
        disabled={!valid}
        loading={pending}
        onPress={() =>
          void submit(async () => {
            await update((current) =>
              editMeal(current, entry.id, number, meal),
            );
            onClose();
          })
        }
      />
      <Button label="Cancel" secondary disabled={pending} onPress={onClose} />
    </Screen>
  );
}
