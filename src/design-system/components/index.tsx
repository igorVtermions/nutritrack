import type { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radii, space, type } from '../tokens';
import { AppIcon } from '../icons/AppIcon';
export function AppText({
  variant = 'body',
  muted = false,
  style,
  ...props
}: TextProps & { variant?: keyof typeof type; muted?: boolean }) {
  return (
    <Text
      {...props}
      style={[
        { color: muted ? colors.muted : colors.ink },
        type[variant],
        style,
      ]}
    />
  );
}
export function Screen({
  children,
  bottomInset = true,
}: PropsWithChildren<{ bottomInset?: boolean }>) {
  return (
    <SafeAreaView
      style={styles.safe}
      edges={
        bottomInset
          ? ['top', 'left', 'right', 'bottom']
          : ['top', 'left', 'right']
      }
    >
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Button({
  label,
  onPress,
  loading = false,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary ? colors.soft : colors.lime,
          opacity: pressed || disabled ? 0.6 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <AppText variant="label">{label}</AppText>
      )}
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: space.sm }}>
      <AppText variant="label" muted>
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        {...props}
        style={[styles.input, props.style]}
      />
    </View>
  );
}
export function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <View style={styles.row}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.iconButton}
        >
          <AppIcon name="back" />
        </Pressable>
      )}
      <AppText variant={onBack ? 'section' : 'title'} style={{ flex: 1 }}>
        {title}
      </AppText>
    </View>
  );
}
export function ErrorMessage({ message }: { message: string | null }) {
  return message ? (
    <AppText accessibilityRole="alert" accessibilityLiveRegion="polite">
      {message}
    </AppText>
  ) : null;
}
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: space.page, gap: space.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  card: {
    backgroundColor: colors.white,
    padding: space.lg,
    borderRadius: radii.card,
    gap: space.sm,
  },
  hero: {
    backgroundColor: colors.ink,
    padding: space.page,
    borderRadius: radii.hero,
    gap: space.lg,
  },
  button: {
    minHeight: 54,
    borderRadius: radii.button,
    padding: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    minHeight: 54,
    borderRadius: radii.card,
    backgroundColor: colors.white,
    padding: space.lg,
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  iconButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
