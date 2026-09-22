import { View } from 'react-native';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Button,
  ErrorMessage,
  Screen,
  styles,
} from '@/design-system/components';
import { AppIcon } from '@/design-system/icons/AppIcon';
import { space } from '@/design-system/tokens';
import { useSubmission } from '@/shared/hooks/useSubmission';
export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const { update } = useDiary();
  const { submit, pending, error } = useSubmission();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: space.xxl }}>
        <View style={{ alignItems: 'center', gap: space.lg }}>
          <AppIcon name="logo" size={68} />
          <AppText variant="title">NutriTrack</AppText>
        </View>
        <View style={{ paddingHorizontal: space.xl, gap: space.xl }}>
          <AppText variant="display">Small steps.{'\n'}Every day.</AppText>
          <AppText muted>
            A little more awareness.{'\n'}One meal at a time.
          </AppText>
        </View>
        <View style={[styles.row, { justifyContent: 'center' }]}>
          <AppIcon name="oatmeal" size={104} />
          <AppIcon name="salad" size={90} />
        </View>
      </View>
      <ErrorMessage message={error} />
      <Button
        label="Start tracking"
        loading={pending}
        onPress={() =>
          void submit(async () => {
            await update((state) => ({ ...state, onboarded: true }));
            onComplete();
          })
        }
      />
      <AppText variant="label" muted style={{ textAlign: 'center' }}>
        Your food. Your pace. Your space.
      </AppText>
    </Screen>
  );
}
