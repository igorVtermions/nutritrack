import { Alert } from 'react-native';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Button,
  ErrorMessage,
  Header,
  Screen,
} from '@/design-system/components';
import { AppIcon } from '@/design-system/icons/AppIcon';
import { useSubmission } from '@/shared/hooks/useSubmission';
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
  return (
    <Screen>
      <Header title="Meal details" onBack={onBack} />
      {entry ? (
        <>
          <AppIcon name={entry.illustration} size={136} />
          <AppText variant="section">{entry.name}</AppText>
          <AppText>
            {entry.meal} · {entry.date}
          </AppText>
          <AppText>
            {entry.quantity} × {entry.serving}
          </AppText>
          <AppText>{Math.round(entry.nutrition.calories)} kcal</AppText>
          <ErrorMessage message={error} />
          <Button
            label="Delete meal"
            loading={pending}
            secondary
            onPress={() =>
              Alert.alert(
                'Delete this meal?',
                'This removes the entry from your local diary.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () =>
                      void submit(async () => {
                        await update((current) => ({
                          ...current,
                          entries: current.entries.filter(
                            (item) => item.id !== entryId,
                          ),
                        }));
                        onBack();
                      }),
                  },
                ],
              )
            }
          />
        </>
      ) : (
        <AppText>This entry is no longer in your diary.</AppText>
      )}
    </Screen>
  );
}
