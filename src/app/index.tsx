import { Redirect, useRouter } from 'expo-router';
import { useDiary } from '@/bootstrap/AppProvider';
import { WelcomeScreen } from '@/features/onboarding/WelcomeScreen';
export default function Index() {
  const { state } = useDiary();
  const router = useRouter();
  if (state.onboarded) return <Redirect href="/(tabs)/today" />;
  return <WelcomeScreen onComplete={() => router.replace('/(tabs)/today')} />;
}
