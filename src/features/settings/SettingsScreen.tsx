import { useState } from 'react';
import { useDiary } from '@/bootstrap/AppProvider';
import {
  AppText,
  Button,
  ErrorMessage,
  Field,
  Header,
  Screen,
} from '@/design-system/components';
import { useSubmission } from '@/shared/hooks/useSubmission';
export function SettingsScreen({ onTargets }: { onTargets: () => void }) {
  const { state, update } = useDiary();
  const [name, setName] = useState(state.name);
  const [saved, setSaved] = useState(false);
  const { submit, pending, error } = useSubmission();
  return (
    <Screen bottomInset={false}>
      <Header title="Your space" />
      <AppText muted>A few things, just the way you like.</AppText>
      <Field
        label="Your name (optional)"
        value={name}
        maxLength={80}
        onChangeText={(value) => {
          setName(value);
          setSaved(false);
        }}
        autoComplete="given-name"
      />
      <ErrorMessage message={error} />
      <Button
        label="Save name"
        loading={pending}
        onPress={() =>
          void submit(async () => {
            await update((current) => ({ ...current, name: name.trim() }));
            setSaved(true);
          })
        }
      />
      {saved && (
        <AppText accessibilityLiveRegion="polite">
          Name saved on this device.
        </AppText>
      )}
      <Button
        label={`Daily targets · ${state.targets.calories} kcal`}
        secondary
        onPress={onTargets}
      />
      <AppText variant="label">Units: Metric · Appearance: Light</AppText>
      <AppText variant="section">Privacy & data</AppText>
      <AppText>
        Your diary stays on this device. No account or cloud sync is used.
        Uninstalling the app or clearing app data may remove your entries.
      </AppText>
      <AppText variant="caption" muted>
        NutriTrack · Local prototype
      </AppText>
    </Screen>
  );
}
