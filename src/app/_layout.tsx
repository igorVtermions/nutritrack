import { Stack, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/bootstrap/AppProvider';
import { AppText, Screen } from '@/design-system/components';
import { colors } from '@/design-system/tokens';
void SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {error ? (
        <Screen>
          <AppText>Couldn’t load the fonts. Please reopen the app.</AppText>
        </Screen>
      ) : loaded ? (
        <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          />
        </AppProvider>
      ) : null}
    </SafeAreaProvider>
  );
}
